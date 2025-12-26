import { AlertCircle, Sliders } from "lucide-react";
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
    const roi = prediction
        ? ((prediction - currentPrice) / currentPrice) * 100
        : 0;

    return (
        <div className="space-y-4">
            {/* MAIN CARD */}
            <div className="bg-[#15151A] border border-gray-800 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-center min-h-[200px]">
                {!prediction ? (
                    <div className="flex flex-col items-center text-gray-600">
                        <Sliders size={32} className="mb-2 opacity-50" />
                        <p className="text-sm">
                            Ajusta los sliders y ejecuta para ver el impacto.
                        </p>
                    </div>
                ) : (
                    <div className="animate-in fade-in zoom-in duration-300">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-xs text-purple-400 font-bold uppercase mb-1">
                                    Proyección de IA
                                </p>
                                <h2 className="text-5xl font-bold text-white mb-2">
                                    $
                                    {prediction.toLocaleString(undefined, {
                                        maximumFractionDigits: 0,
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
                                className={`px-4 py-3 rounded-xl border flex flex-col items-center ${
                                    prediction > currentPrice
                                        ? "border-green-500/30 bg-green-500/10"
                                        : "border-red-500/30 bg-red-500/10"
                                }`}
                            >
                                <span className="text-[10px] font-bold uppercase text-gray-400 mb-1">
                                    Señal Sugerida
                                </span>
                                <span
                                    className={`text-xl font-black ${
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

                        <div className="mt-6 bg-[#0E0E12] p-3 rounded-lg border border-gray-800 flex gap-3 items-start">
                            <AlertCircle
                                className="text-gray-400 mt-1 shrink-0"
                                size={16}
                            />
                            <p className="text-xs text-gray-400 leading-relaxed">
                                <span className="text-white font-bold">
                                    Análisis:
                                </span>{" "}
                                Con un RSI de{" "}
                                <span className="text-white">
                                    {features.rsi.toFixed(2)}
                                </span>{" "}
                                y volatilidad de{" "}
                                {features.volatility.toFixed(2)}, el modelo
                                predice una{" "}
                                {prediction > currentPrice
                                    ? "recuperación alcista"
                                    : "corrección bajista"}
                                .
                                {features.rsi > 70
                                    ? " Precaución: El mercado está sobrecomprado."
                                    : ""}
                                {features.rsi < 30
                                    ? " Oportunidad: El mercado está sobrevendido."
                                    : ""}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* SCENARIO GRAPH */}
            {prediction !== null && (
                <div className="bg-[#15151A] border border-gray-800 rounded-2xl p-4 h-[180px]">
                    <p className="text-[10px] text-gray-500 uppercase font-bold mb-2">
                        Proyección Visual
                    </p>
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
                                domain={["dataMin", "dataMax"]}
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
                </div>
            )}
        </div>
    );
}
