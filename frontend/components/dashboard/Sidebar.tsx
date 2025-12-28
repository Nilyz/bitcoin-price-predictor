import { Bitcoin, Activity, Wallet } from "lucide-react";
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
        <aside className="w-20 lg:w-64 border-r border-gray-800 flex flex-col justify-between p-4 hidden md:flex bg-[#0E0E12]">
            <div>
                <div className="mb-10 px-4 flex items-center gap-3">
                    <div className="relative w-10 h-10">
                        {" "}
                        <Image
                            src="/Tradecore_logo.png"
                            alt="TradeCore Logo"
                            fill
                            className="object-contain"
                        />
                    </div>

                    <h1 className="text-2xl font-bold tracking-tighter text-white">
                        TradeCore
                    </h1>
                </div>
                <nav className="space-y-2">
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-[#1C1C24] text-cyan-400 border border-gray-800">
                        <Activity size={20} />{" "}
                        <span className="hidden lg:block font-medium">
                            Simulator
                        </span>
                    </button>
                </nav>
            </div>

            <div className="bg-[#15151A] p-4 rounded-xl border border-gray-800 hidden lg:block">
                <label className="text-[10px] text-gray-500 uppercase font-bold flex items-center gap-1 mb-2">
                    <Wallet size={12} /> Simulated Investment
                </label>
                <div className="flex items-center bg-[#0E0E12] border border-gray-700 rounded px-2">
                    <span className="text-gray-400">$</span>
                    <input
                        type="number"
                        value={investment}
                        onChange={(e) => setInvestment(Number(e.target.value))}
                        className="bg-transparent w-full p-2 outline-none text-white font-mono text-sm"
                    />
                </div>
                {prediction !== null && (
                    <div
                        className={`mt-3 text-sm font-bold ${
                            potentialProfit >= 0
                                ? "text-green-400"
                                : "text-red-400"
                        }`}
                    >
                        {potentialProfit >= 0 ? "+" : ""}
                        {potentialProfit.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })}{" "}
                        USD ({roi.toFixed(2)}%)
                    </div>
                )}
            </div>
        </aside>
    );
}
