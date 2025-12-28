import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import RunningTrades from "./RunningTrades";

interface LiveMarketTickerProps {
    currentPrice: number;
    trend: "up" | "down";
    isLive: boolean;
    history: any[];
}

export default function LiveMarketTicker({
    currentPrice,
    trend,
    isLive,
    history,
}: LiveMarketTickerProps) {
    return (
        <section className="w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-4 gap-4">
                <div>
                    <h2 className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">
                        Current Price
                    </h2>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                        <span className="text-4xl sm:text-6xl font-bold tracking-tighter text-white">
                            $
                            {currentPrice.toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            })}
                        </span>
                        {isLive && (
                            <span
                                className={`text-xs sm:text-sm px-2 py-1 rounded ${
                                    trend === "up"
                                        ? "text-green-400 bg-green-500/10"
                                        : "text-red-400 bg-red-500/10"
                                }`}
                            >
                                {trend === "up" ? "▲" : "▼"} LIVE
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                {/* GRAPH */}
                <div className="lg:col-span-3 bg-[#15151A] rounded-2xl border border-gray-800 p-4 relative overflow-hidden h-64 sm:h-72 md:h-80 lg:h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={history}>
                            <defs>
                                <linearGradient
                                    id="colorLive"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >
                                    <stop
                                        offset="5%"
                                        stopColor="#06b6d4"
                                        stopOpacity={0.3}
                                    />
                                    <stop
                                        offset="95%"
                                        stopColor="#06b6d4"
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
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                domain={["dataMin", "dataMax"]}
                                orientation="right"
                                stroke="#52525b"
                                tick={{ fontSize: 10 }}
                                tickFormatter={(v) =>
                                    `$${v.toLocaleString("en-US", {
                                        maximumFractionDigits: 0,
                                    })}`
                                }
                                axisLine={false}
                                tickLine={false}
                                width={60}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#18181b",
                                    borderColor: "#27272a",
                                    color: "#fff",
                                }}
                                formatter={(value: any) => [
                                    `$${Number(value).toLocaleString("en-US", {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}`,
                                    "Price",
                                ]}
                            />
                            <Area
                                type="monotone"
                                dataKey="price"
                                stroke="#06b6d4"
                                strokeWidth={2}
                                fill="url(#colorLive)"
                                isAnimationActive={false}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                <div className="lg:col-span-1 overflow-y-auto h-64 sm:h-72 md:h-80 lg:h-[280px]">
                    <RunningTrades history={history} />
                </div>
            </div>
        </section>
    );
}
