import { AlertCircle, Sliders, Activity } from "lucide-react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
} from "recharts";

interface PredictionCardProps {
    prediction: number | null;
    currentPrice: number;
    features: any;
    forecastHistory: any[];
}

export default function PredictionCard({
    prediction,
    currentPrice,
    features,
    forecastHistory,
}: PredictionCardProps) {
    const roi =
        prediction && currentPrice
            ? ((prediction - currentPrice) / currentPrice) * 100
            : 0;

    return (
        <div className="flex flex-col gap-4 h-[600px] lg:h-full">
            <div className="flex-1 bg-[#15151A] border border-gray-800 rounded-2xl p-5 lg:p-6 relative overflow-hidden flex flex-col justify-center min-h-0">
                {!prediction ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-600">
                        <Sliders size={32} className="mb-3 opacity-50" />
                        <p className="text-sm">Adjust controls to predict.</p>
                    </div>
                ) : (
                    <div className="animate-in fade-in zoom-in duration-300 flex flex-col justify-center h-full gap-4 lg:gap-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-xs text-purple-400 font-bold uppercase mb-1">
                                    AI Projection
                                </p>
                                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                                    $
                                    {prediction.toLocaleString("en-US", {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}
                                </h2>
                                <div className="flex gap-2">
                                    <span
                                        className={`px-2 py-1 rounded text-xs font-bold ${
                                            prediction > currentPrice
                                                ? "bg-green-500/20 text-green-400"
                                                : "bg-red-500/20 text-red-400"
                                        }`}
                                    >
                                        {prediction > currentPrice
                                            ? `▲ +${roi.toFixed(2)}%`
                                            : `▼ ${roi.toFixed(2)}%`}
                                    </span>
                                </div>
                            </div>

                            <div
                                className={`px-3 py-2 lg:px-4 lg:py-3 rounded-xl border flex flex-col items-center min-w-[90px] lg:min-w-[100px] ${
                                    prediction > currentPrice
                                        ? "border-green-500/30 bg-green-500/10"
                                        : "border-red-500/30 bg-red-500/10"
                                }`}
                            >
                                <span className="text-[10px] font-bold uppercase text-gray-400 mb-1">
                                    Signal
                                </span>
                                <span
                                    className={`text-xs lg:text-xl font-black ${
                                        prediction > currentPrice
                                            ? "text-green-400"
                                            : "text-red-400"
                                    }`}
                                >
                                    {prediction > currentPrice
                                        ? "STRONG BUY"
                                        : "PANIC SELL"}
                                </span>
                            </div>
                        </div>

                        {/* Tags section */}
                        <div className="bg-[#0E0E12] p-3 lg:p-4 rounded-xl border border-gray-800 flex flex-wrap items-center gap-2 lg:gap-3">
                            <div className="flex items-center gap-2 shrink-0">
                                <AlertCircle
                                    className="text-cyan-400"
                                    size={18}
                                />
                                <span className="text-[10px] lg:text-xs font-bold text-white uppercase tracking-wider">
                                    Analysis
                                </span>
                            </div>

                            <div className="h-4 w-px bg-gray-700 hidden sm:block"></div>

                            <div className="flex flex-wrap gap-2">
                                {features.rsi > 70 ? (
                                    <span className="text-[10px] lg:text-xs font-medium bg-red-500/20 text-red-200 border border-red-500/40 px-2 py-1 rounded">
                                        ⚠️ Overbought
                                    </span>
                                ) : features.rsi < 30 ? (
                                    <span className="text-[10px] lg:text-xs font-medium bg-green-500/20 text-green-200 border border-green-500/40 px-2 py-1 rounded">
                                        💎 Oversold
                                    </span>
                                ) : (
                                    <span className="text-[10px] lg:text-xs font-medium bg-gray-800 text-gray-300 border border-gray-600 px-2 py-1 rounded">
                                        Neutral
                                    </span>
                                )}

                                {features.volatility > 1000 ? (
                                    <span className="text-[10px] lg:text-xs font-medium bg-purple-500/20 text-purple-200 border border-purple-500/40 px-2 py-1 rounded">
                                        ⚡ Volatile
                                    </span>
                                ) : (
                                    <span className="text-[10px] lg:text-xs font-medium bg-blue-500/20 text-blue-200 border border-blue-500/40 px-2 py-1 rounded">
                                        🌊 Stable
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* --- BOTTOM CARD --- */}
            <div className="flex-1 bg-[#15151A] border border-gray-800 rounded-2xl p-4 flex flex-col min-h-0">
                <p className="text-[10px] text-gray-500 uppercase font-bold mb-2 shrink-0">
                    Visual Projection
                </p>
                <div className="flex-1 w-full min-h-0">
                    {forecastHistory && forecastHistory.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={forecastHistory}>
                                <defs>
                                    <linearGradient
                                        id="colorScen"
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                    >
                                        <stop
                                            offset="5%"
                                            stopColor="#8b5cf6"
                                            stopOpacity={0.3}
                                        />
                                        <stop
                                            offset="95%"
                                            stopColor="#8b5cf6"
                                            stopOpacity={0}
                                        />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="#232329"
                                    vertical={false}
                                />
                                <XAxis
                                    dataKey="time"
                                    stroke="#52525b"
                                    tick={{ fontSize: 10 }}
                                />
                                <YAxis
                                    domain={["auto", "auto"]}
                                    orientation="right"
                                    stroke="#52525b"
                                    tick={{ fontSize: 10 }}
                                    tickFormatter={(v) => `$${v / 1000}k`}
                                    width={40}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "#18181b",
                                        borderColor: "#27272a",
                                        color: "#fff",
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="price"
                                    stroke="#8b5cf6"
                                    strokeWidth={3}
                                    fill="url(#colorScen)"
                                />
                                <ReferenceLine
                                    y={currentPrice}
                                    stroke="gray"
                                    strokeDasharray="3 3"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full w-full flex flex-col items-center justify-center text-gray-700 gap-2">
                            <Activity size={24} className="opacity-20" />
                            <span className="text-xs font-mono uppercase tracking-widest opacity-40">
                                Awaiting Simulation
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
