import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error
import joblib
import os

def train_model():
    # 1. Load Processed Data
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)
    data_path = os.path.join(project_root, "data", "bitcoin_processed.csv")
    
    # Check if file exists
    if not os.path.exists(data_path):
        print(" Error: Processed data not found. Run 'preprocessing.py' first.")
        return

    df = pd.read_csv(data_path)
    
    # 2. Define Features (X) and Target (y)
    features = ['sma_7', 'sma_30', 'rsi', 'price_lag_1', 'price_lag_7', 'volatility']
    target = 'price'
    
    X = df[features]
    y = df[target]
    
    # 3. Split Data (Train / Test)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, shuffle=False)
    
    print(f"Training with {len(X_train)} days, Testing with {len(X_test)} days.")
    
    # 4. Train Model (Random Forest)
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    # 5. Evaluate Model
    predictions = model.predict(X_test)
    mae = mean_absolute_error(y_test, predictions)
    print(f" Model Trained. Mean Absolute Error (MAE): ${mae:.2f} USD")
    
    # 6. Save Model for the Backend
    backend_dir = os.path.join(project_root, "backend")
    os.makedirs(backend_dir, exist_ok=True)
    
    model_path = os.path.join(backend_dir, "bitcoin_model.pkl")
    joblib.dump(model, model_path)
    print(f" Model saved to: {model_path}")

if __name__ == "__main__":
    train_model()