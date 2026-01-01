from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import pandas as pd
import os
from fastapi.middleware.cors import CORSMiddleware
import requests
import pandas as pd


# 1. Initialize the App
app = FastAPI(title="Bitcoin Price Predictor API", version="1.0")

origins = [
    "http://localhost:3000",             
    "https://tradecore-ai.vercel.app",   
    "https://tradecore-ai.vercel.app/"  
]

# Allow frontend to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

    # 2. Load the model at startup
current_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(current_dir, "bitcoin_model.pkl")

try:
    model = joblib.load(model_path)
    print(f"Model loaded successfully from: {model_path}")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None


# 3. Define the structure of input data
class BitcoinFeatures(BaseModel):
    sma_7: float
    sma_30: float
    rsi: float
    price_lag_1: float
    price_lag_7: float
    volatility: float


@app.get("/")
def home():
    return {"message": "Bitcoin Price Predictor API is running."}


@app.post("/predict")
def predict_price(features: BitcoinFeatures):
    if model is None:
        raise HTTPException(status_code=500, detail="Model not loaded")

    try:
        data_dict = features.dict()
        input_data = pd.DataFrame([data_dict])
        
        correct_order = ["sma_7", "sma_30", "rsi", "price_lag_1", "price_lag_7", "volatility"]
        input_data = input_data[correct_order]
        
        base_prediction = model.predict(input_data)[0]
        
        adjustment = 0
        
        # RSI Logic (If it's very high, the price tends to fall)
        if features.rsi > 60:
            factor = (features.rsi - 60) / 100
            adjustment = -(base_prediction * factor * 0.05)
        elif features.rsi < 40:
            factor = (40 - features.rsi) / 100
            adjustment = (base_prediction * factor * 0.05) 

        # Volatility Logic (Amplifies the movement)
        vol_factor = 1 + (features.volatility / 10000)
        
        final_prediction = (base_prediction + adjustment) * vol_factor

        return {"predicted_price": float(final_prediction), "currency": "USD"}

    except Exception as e:
        print(f"ERROR: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# --- FUNCTION TO CALCULATE REAL-TIME INDICATORS ---
def get_latest_bitcoin_data():
    url = "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart"
    params = {
        "vs_currency": "usd",
        "days": "60",
        "interval": "daily",
    }
    
    try:
        response = requests.get(url, params=params, timeout=5)
        
        if response.status_code != 200:
            raise Exception(f"API Error: {response.status_code}")

        data = response.json()
        
        # validate data structure
        if "prices" not in data:
            raise Exception("Invalid data structure from API")

        prices = data["prices"]

        df = pd.DataFrame(prices, columns=["timestamp", "price"])
        df["date"] = pd.to_datetime(df["timestamp"], unit="ms")

        # calculate Indicators
        df["sma_7"] = df["price"].rolling(window=7).mean()
        df["sma_30"] = df["price"].rolling(window=30).mean()

        # RSI Calculation
        delta = df["price"].diff()
        gain = (delta.where(delta > 0, 0)).rolling(window=14).mean()
        loss = (-delta.where(delta < 0, 0)).rolling(window=14).mean()
        rs = gain / loss
        df["rsi"] = 100 - (100 / (1 + rs))

        df["volatility"] = df["price"].rolling(window=7).std()
        df["price_lag_1"] = df["price"].shift(1)
        df["price_lag_7"] = df["price"].shift(7)

        latest = df.iloc[-1]

        return {
            "sma_7": float(latest["sma_7"]),
            "sma_30": float(latest["sma_30"]),
            "rsi": float(latest["rsi"]),
            "price_lag_1": float(latest["price_lag_1"]),
            "price_lag_7": float(latest["price_lag_7"]),
            "volatility": float(latest["volatility"]),
            "current_price": float(latest["price"]),
        }

    except Exception as e:
        print(f"⚠️ Error fetching external data (using fallback): {e}")
        
        # FALLBACK DATA
        return {
            "sma_7": 87500.0,
            "sma_30": 86000.0,
            "rsi": 50.0,
            "price_lag_1": 87900.0,
            "price_lag_7": 85000.0,
            "volatility": 1200.0,
            "current_price": 88500.0, # Precio estimado seguro
        }


@app.get("/current-data")
def get_current_data():
    try:
        data = get_latest_bitcoin_data()
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# To run the server:
# uvicorn backend.main:app --reload
