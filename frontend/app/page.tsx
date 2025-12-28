"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import LiveMarketTicker from "@/components/dashboard/LiveMarketTicker";
import ControlPanel from "@/components/dashboard/ControlPanel";
import PredictionCard from "@/components/dashboard/PredictionCard";

export default function Home() {
    // --- STATES ---
    const [features, setFeatures] = useState({
        sma_7: 0,
        sma_30: 0,
        rsi: 50,
        price_lag_1: 0,
        price_lag_7: 0,
        volatility: 0,
    });

    const [prediction, setPrediction] = useState<number | null>(null);
    const [currentPrice, setCurrentPrice] = useState<number>(0);
    const [isLive, setIsLive] = useState(false);
    const [trend, setTrend] = useState<"up" | "down">("up");
    const [investment, setInvestment] = useState(1000);
    const [liveHistory, setLiveHistory] = useState<any[]>([]);
    const [forecastHistory, setForecastHistory] = useState<any[]>([]);
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

    // --- DATA LOGIC  ---
    const fetchRealData = async () => {
        try {
            // 1. Connect to Backend
            const res = await fetch(`${API_URL}/current-data`);

            if (!res.ok) throw new Error("Backend disconnected");

            const data = await res.json();

            setFeatures({
                sma_7: data.sma_7,
                sma_30: data.sma_30,
                rsi: data.rsi,
                price_lag_1: data.price_lag_1,
                price_lag_7: data.price_lag_7,
                volatility: data.volatility,
            });
            setCurrentPrice(data.current_price);

            // Create initial history with data consistent with the current price
            setLiveHistory([
                { time: "10:00", price: data.price_lag_7, volume: 1200 },
                {
                    time: "12:00",
                    price: (data.price_lag_7 + data.price_lag_1) / 2,
                    volume: 2100,
                },
                { time: "14:00", price: data.price_lag_1, volume: 1800 },
                { time: "Now", price: data.current_price, volume: 3200 },
            ]);
        } catch (e) {
            console.error("Error fetching data:", e);
            // Realistic fallback if backend fails (Approximate today's price)
            const fallbackPrice = 87500.0;
            setCurrentPrice(fallbackPrice);
            setFeatures((prev) => ({ ...prev, price_lag_1: fallbackPrice }));
            setLiveHistory([{ time: "Now", price: fallbackPrice, volume: 0 }]);
        }
    };

    const handleManualChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFeatures({
            ...features,
            [e.target.name]: parseFloat(e.target.value),
        });
    };

    // --- SIMULATION VISUAL ---
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isLive && currentPrice > 0) {
            interval = setInterval(() => {
                const volatility = (Math.random() - 0.5) * 80;
                const newPrice = currentPrice + volatility;
                const newVol = Math.floor(Math.random() * 3000) + 500;

                setTrend(newPrice > currentPrice ? "up" : "down");
                setCurrentPrice(newPrice);

                setLiveHistory((prev) => {
                    const newPoint = {
                        time: new Date().toLocaleTimeString([], {
                            minute: "2-digit",
                            second: "2-digit",
                        }),
                        price: newPrice,
                        volume: newVol,
                    };
                    const newHistory = [...prev, newPoint];
                    if (newHistory.length > 40) newHistory.shift();
                    return newHistory;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isLive, currentPrice]);

    // --- PREDICTION (CONNECTED TO BACKEND) ---
    const handlePredict = async () => {
        try {
            console.log("Sending scenario to Backend...");

            // Send features + current price lagged to backend
            const inputData = { ...features, price_lag_1: currentPrice };

            const response = await fetch(`${API_URL}/predict`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(inputData),
            });

            if (!response.ok) throw new Error("Error in prediction");

            const data = await response.json();
            const newPrediction = data.predicted_price;

            setPrediction(newPrediction);

            let baselinePoints = [];
            if (liveHistory.length > 0) {
                baselinePoints = liveHistory
                    .slice(-3)
                    .map((p) => ({ ...p, type: "history" }));
            } else {
                baselinePoints = [
                    { time: "Now", price: currentPrice, type: "history" },
                ];
            }

            setForecastHistory([
                ...baselinePoints,
                { time: "SCENARIO", price: newPrediction, type: "prediction" },
            ]);
        } catch (err) {
            console.error(err);
            alert("Error: Make sure the backend (main.py) is running.");
        }
    };

    return (
        <div className="min-h-screen bg-[#0E0E12] text-white font-sans flex overflow-hidden selection:bg-cyan-500/30">
            <Sidebar
                investment={investment}
                setInvestment={setInvestment}
                prediction={prediction}
                currentPrice={currentPrice}
            />

            <main className="flex-1 flex flex-col h-screen overflow-y-auto overflow-x-hidden">
                <Header
                    isLive={isLive}
                    setIsLive={setIsLive}
                    onReset={fetchRealData}
                />

                <div className="p-6 space-y-6">
                    <LiveMarketTicker
                        currentPrice={currentPrice}
                        trend={trend}
                        isLive={isLive}
                        history={liveHistory}
                    />

                    <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        <ControlPanel
                            features={features}
                            handleManualChange={handleManualChange}
                            onPredict={handlePredict}
                        />

                        <div className="lg:col-span-7">
                            <PredictionCard
                                prediction={prediction}
                                currentPrice={currentPrice}
                                features={features}
                                forecastHistory={forecastHistory}
                            />
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
