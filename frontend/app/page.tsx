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

    // --- DATA LOGIC ---
    const fetchRealData = async () => {
        try {
            // MOCK DATA
            const mockData = {
                sma_7: 42000,
                sma_30: 41000,
                rsi: 55.43,
                price_lag_1: 43100,
                price_lag_7: 42500,
                volatility: 120.5,
                current_price: 43250.75,
            };

            setFeatures({
                sma_7: mockData.sma_7,
                sma_30: mockData.sma_30,
                rsi: mockData.rsi,
                price_lag_1: mockData.price_lag_1,
                price_lag_7: mockData.price_lag_7,
                volatility: mockData.volatility,
            });
            setCurrentPrice(mockData.current_price);

            setLiveHistory([
                { time: "10:00", price: mockData.price_lag_7, volume: 1200 },
                {
                    time: "12:00",
                    price: (mockData.price_lag_7 + mockData.price_lag_1) / 2,
                    volume: 2100,
                },
                { time: "14:00", price: mockData.price_lag_1, volume: 1800 },
                { time: "Now", price: mockData.current_price, volume: 3200 },
            ]);
        } catch (e) {
            console.error(e);
        }
    };

    const handleManualChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFeatures({
            ...features,
            [e.target.name]: parseFloat(e.target.value),
        });
    };

    // --- SIMULATION ---
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

    const handlePredict = async () => {
        try {
            const inputData = { ...features, price_lag_1: currentPrice };
            const response = await fetch("http://127.0.0.1:8000/predict", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(inputData),
            });
            const data = await response.json();
            setPrediction(data.predicted_price);

            const lastPoints = liveHistory.slice(-3);
            setForecastHistory([
                ...lastPoints.map((p) => ({ ...p, type: "history" })),
                {
                    time: "SCENARIO",
                    price: data.predicted_price,
                    type: "prediction",
                },
            ]);
        } catch (err) {
                  // Fallback if no backend
            const dummyPrediction = currentPrice * 1.02;
            setPrediction(dummyPrediction);
            const lastPoints = liveHistory.slice(-3);
            setForecastHistory([
                ...lastPoints.map((p) => ({ ...p, type: "history" })),
                {
                    time: "SCENARIO",
                    price: dummyPrediction,
                    type: "prediction",
                },
            ]);
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

            <main className="flex-1 flex flex-col h-screen overflow-y-auto">
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
