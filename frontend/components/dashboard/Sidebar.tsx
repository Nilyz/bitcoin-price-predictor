import { Bitcoin, Activity, Wallet, TrendingUp } from "lucide-react";
import Image from "next/image";

interface SidebarProps {
    investment: number;
    setInvestment: (val: number) => void;
    prediction: number | null;
    currentPrice: number;
}

export default function Sidebar({
    investment,
    setInvestment,
    prediction,
    currentPrice,
}: SidebarProps) {
    const potentialProfit = prediction
        ? ((prediction - currentPrice) / currentPrice) * investment
        : 0;
    const roi = prediction
        ? ((prediction - currentPrice) / currentPrice) * 100
        : 0;

    return (
        <>
            {/* --- DESKTOP & TABLET SIDEBAR--- */}
            <aside className="hidden md:flex w-20 lg:w-64 border-r border-gray-800 flex-col justify-between p-4 bg-[#0E0E12] transition-all duration-300 z-40 h-screen sticky top-0">
                <div>
                    <div className="mb-10 flex items-center justify-center lg:justify-start gap-3 px-2 lg:px-4">
                        <div className="relative w-8 h-8 lg:w-10 lg:h-10 shrink-0">
                            <Image
                                src="/Tradecore_logo.png" 
                                alt="TradeCore Logo"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <h1 className="text-xl lg:text-2xl font-bold tracking-tighter text-white hidden lg:block">
                            TradeCore
                        </h1>
                    </div>

                    <nav className="space-y-2">
                        <button className="w-full flex items-center justify-center lg:justify-start gap-3 px-2 lg:px-4 py-3 rounded-xl bg-[#1C1C24] text-cyan-400 border border-gray-800 hover:bg-[#252530] transition-colors group">
                            <Activity size={24} className="shrink-0" />
                            <span className="hidden lg:block font-medium">
                                Simulator
                            </span>
                            {/* Tooltip para Tablet */}
                            <span className="absolute left-16 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 lg:hidden pointer-events-none transition-opacity whitespace-nowrap z-50">
                                Simulator Mode
                            </span>
                        </button>
                    </nav>
                </div>

                <div className="bg-[#15151A] p-4 rounded-xl border border-gray-800 hidden lg:block">
                    <label className="text-[10px] text-gray-500 uppercase font-bold flex items-center gap-1 mb-2">
                        <Wallet size={12} /> Simulated Investment
                    </label>
                    <div className="flex items-center bg-[#0E0E12] border border-gray-700 rounded px-2 focus-within:border-cyan-500 transition-colors">
                        <span className="text-gray-400">$</span>
                        <input
                            type="number"
                            value={investment}
                            onChange={(e) =>
                                setInvestment(Number(e.target.value))
                            }
                            className="bg-transparent w-full p-2 outline-none text-white font-mono text-sm placeholder-gray-600"
                            placeholder="1000"
                        />
                    </div>

                    {prediction !== null && (
                        <div
                            className={`mt-3 text-sm font-bold flex justify-between items-center ${
                                potentialProfit >= 0
                                    ? "text-green-400"
                                    : "text-red-400"
                            }`}
                        >
                            <span>
                                {potentialProfit >= 0 ? "+" : ""}
                                {potentialProfit.toLocaleString("en-US", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })}{" "}
                                USD
                            </span>
                            <span className="text-xs opacity-80">
                                ({roi.toFixed(2)}%)
                            </span>
                        </div>
                    )}
                </div>

                <div className="lg:hidden flex flex-col items-center gap-2 mb-4">
                    <div className="w-10 h-10 rounded-full bg-[#15151A] border border-gray-800 flex items-center justify-center text-gray-400">
                        <Wallet size={18} />
                    </div>
                    {prediction !== null && (
                        <span
                            className={`text-[10px] font-bold ${
                                roi >= 0 ? "text-green-400" : "text-red-400"
                            }`}
                        >
                            {roi >= 0 ? "+" : ""}
                            {roi.toFixed(1)}%
                        </span>
                    )}
                </div>
            </aside>

            {/* --- MOBILE BOTTOM BAR --- */}
            <div className="md:hidden fixed bottom-0 left-0 w-full bg-[#0E0E12]/95 backdrop-blur border-t border-gray-800 z-50 px-4 py-3 flex justify-between items-center safe-area-bottom">
                <div className="flex items-center gap-2">
                    <div className="relative w-8 h-8">
                        <Image
                            src="/Tradecore_logo.png"
                            alt="Logo"
                            fill
                            className="object-contain"
                        />
                    </div>
                </div>

                {/* Info Rápida de Beneficio */}
                {prediction !== null ? (
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] text-gray-500 uppercase font-bold">
                            Proj. Profit
                        </span>
                        <div
                            className={`text-sm font-mono font-bold ${
                                potentialProfit >= 0
                                    ? "text-green-400"
                                    : "text-red-400"
                            }`}
                        >
                            {potentialProfit >= 0 ? "+" : ""}$
                            {potentialProfit.toFixed(2)}
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 text-gray-500">
                        <Activity size={16} />
                        <span className="text-xs font-medium">
                            Simulator Ready
                        </span>
                    </div>
                )}

                <div className="bg-[#1C1C24] p-2 rounded-lg border border-gray-700">
                    <span className="text-xs text-cyan-400 font-bold">
                        ${investment}
                    </span>
                </div>
            </div>
        </>
    );
}
