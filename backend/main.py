from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import pandas as pd
import os
from fastapi.middleware.cors import CORSMiddleware
import requests
import pandas as pd


# 1. Inicializar la App
app = FastAPI(title="Bitcoin Price Predictor API", version="1.0")

# Permitir que el frontend hable con el backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción se pone el dominio real
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. Cargar el modelo al inicio
current_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(current_dir, "bitcoin_model.pkl")

try:
    model = joblib.load(model_path)
    print(f"Modelo cargado correctamente desde: {model_path}")
except Exception as e:
    print(f"Error al cargar el modelo: {e}")
    model = None


# 3. Definir la estructura de los datos de entrada
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
        # 1. Convertir datos de entrada a diccionario
        data_dict = features.dict()

        # 2. Convertir a DataFrame
        input_data = pd.DataFrame([data_dict])

        # Definir el orden usado en ml_model.py
        correct_order = [
            "sma_7",
            "sma_30",
            "rsi",
            "price_lag_1",
            "price_lag_7",
            "volatility",
        ]

        input_data = input_data[correct_order]

        # 5. Predecir
        prediction = model.predict(input_data)

        return {"predicted_price": float(prediction[0]), "currency": "USD"}
    except Exception as e:
        print(f"ERROR: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# --- FUNCIÓN PARA CALCULAR INDICADORES EN TIEMPO REAL ---
def get_latest_bitcoin_data():
    url = "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart"
    params = {
        "vs_currency": "usd",
        "days": "60",
        "interval": "daily",
    }  
    response = requests.get(url, params=params)
    data = response.json()
    prices = data["prices"]

    df = pd.DataFrame(prices, columns=["timestamp", "price"])
    df["date"] = pd.to_datetime(df["timestamp"], unit="ms")

    # Calcular indicadores
    df["sma_7"] = df["price"].rolling(window=7).mean()
    df["sma_30"] = df["price"].rolling(window=30).mean()

    # RSI
    delta = df["price"].diff()
    gain = (delta.where(delta > 0, 0)).rolling(window=14).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(window=14).mean()
    rs = gain / loss
    df["rsi"] = 100 - (100 / (1 + rs))

    # Volatility & Lags
    df["volatility"] = df["price"].rolling(window=7).std()
    df["price_lag_1"] = df["price"].shift(1)
    df["price_lag_7"] = df["price"].shift(7)

    # Devolvemos la ÚLTIMA fila (los datos de HOY)
    latest = df.iloc[-1]

    return {
        "sma_7": latest["sma_7"],
        "sma_30": latest["sma_30"],
        "rsi": latest["rsi"],
        "price_lag_1": latest["price_lag_1"],
        "price_lag_7": latest["price_lag_7"],
        "volatility": latest["volatility"],
        "current_price": latest["price"], 
    }


@app.get("/current-data")
def get_current_data():
    try:
        data = get_latest_bitcoin_data()
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Para correr el servidor:
# uvicorn backend.main:app --reload
