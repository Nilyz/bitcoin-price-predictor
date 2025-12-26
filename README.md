# TradeCore AI
TradeCore AI is an end-to-end full-stack application that predicts Bitcoin prices using Machine Learning and simulates a live trading environment with real-time scenario analysis.

## Preview
![TradeCore Preview](./assets/preview.png "TradeCore Dashboard")

## About
TradeCore AI bridges the gap between static Data Science notebooks and reactive web applications. Unlike traditional dashboards that rely solely on expensive WebSocket feeds, TradeCore implements a **Hybrid Architecture** to deliver a "tick-by-tick" experience using resource-efficient methods.

### How it works
1.  **Data Ingestion** → The Backend (FastAPI) fetches real-time macro data and historical prices from the CoinGecko API.
2.  **ML Inference** → A pre-trained **Random Forest** model processes technical indicators (RSI, SMA, Lag Features) to generate a base price prediction.
3.  **Hybrid Synchronization** → The Frontend receives the "Truth" from the backend and initiates a **Client-side Stochastic Simulation** (Geometric Brownian Motion) to model micro-volatility.
4.  **Scenario Analysis** → Users interact with sliders (RSI, Volatility), sending "What-If" parameters to the Python backend, which applies financial heuristics to adjust the forecast dynamically.
5.  **Visualization** → Next.js renders the data in a responsive "Bento Grid" layout with real-time charting via Recharts.

## Features to highlight
-   **Hybrid Real-Time Architecture:** Combines server-side truth with client-side stochastic simulation to bypass API rate limits while maintaining a live market feel.
-   **ML-Powered Predictions:** Uses a Random Forest Regressor trained on historical BTC data to forecast price trends.
-   **Interactive Scenario Simulator:** A "What-If" analysis tool that allows users to stress-test the market (e.g., "What happens if RSI hits 90?"), generating "Strong Buy" or "Panic Sell" signals.
-   **Bento Grid UI:** A modern, dark-mode interface built with Tailwind CSS, optimized for complex financial data visualization.
-   **Full Stack & Cloud Native:** Deployed architecture using **Vercel** (Frontend) and **Render** (Backend) with automated CI/CD.

## Technologies
TradeCore AI is built with:
-   `Python` & `FastAPI` (Backend & API Layer)
-   `Scikit-Learn` & `Pandas` (Machine Learning Pipeline)
-   `Next.js` (React framework for the Frontend)
-   `TypeScript` (Type safety)
-   `Tailwind CSS` (Styling & Bento Grid layout)
-   `Recharts` (Data Visualization)
-   `Geometric Brownian Motion` (Mathematical modeling for simulation)

## Installation
This is a monorepo containing both Client and Server. Follow these steps to run it locally:

### 1. Backend Setup
Navigate to the backend folder and install Python dependencies:

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### 2. Frontend Setup
Open a new terminal, navigate to the frontend folder, and install Node dependencies:

```bash
cd frontend
npm install
npm run dev
