import requests
import pandas as pd
import os


def fetch_crypto_data():
    base_url = "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart"

    params = {"vs_currency": "usd", "days": "365", "interval": "daily"}

    print(f"1. Connecting to: {base_url}...")

    try:
        # Request
        response = requests.get(base_url, params=params)

        # Check API status
        if response.status_code != 200:
            print(f"API Error. Status Code: {response.status_code}")
            print(f"API Message: {response.text}")
            return

        data = response.json()

        if "prices" not in data:
            print(f" Response missing 'prices' data. Full response: {data}")
            return

        # Process data
        prices = data["prices"]
        print(f" Data received. Total records: {len(prices)}")

        df = pd.DataFrame(prices, columns=["timestamp", "price"])

        df["date"] = pd.to_datetime(df["timestamp"], unit="ms")

        df = df[["date", "price"]]

        # Save file
        script_dir = os.path.dirname(os.path.abspath(__file__))

        project_root = os.path.dirname(script_dir)

        data_dir = os.path.join(project_root, "data")

        os.makedirs(data_dir, exist_ok=True)

        output_path = os.path.join(data_dir, "bitcoin_prices.csv")

        df.to_csv(output_path, index=False)

        print(f"✅ Success! File saved at: {output_path}")

    except Exception as e:
        print(f"❌ Unexpected error: {e}")


if __name__ == "__main__":
    fetch_crypto_data()
