import { List } from "lucide-react";

interface RunningTradesProps {
    history: any[];
}

export default function RunningTrades({ history }: RunningTradesProps) {
    return (
        <div className="lg:col-span-1 bg-[#15151A] rounded-2xl border border-gray-800 flex flex-col h-full overflow-hidden">
            <style jsx>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>

            <div className="flex items-center gap-2 p-3 border-b border-gray-800 bg-[#1C1C24]">
                <List size={14} className="text-gray-400" />
                <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">
                    Running Trades
                </span>
            </div>
            <div className="grid grid-cols-3 px-4 py-2 text-[10px] font-bold text-gray-500 uppercase">
                <span>Time</span>
                <span className="text-right">Price</span>
                <span className="text-right">Vol</span>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-0.5 no-scrollbar">
                {[...history].reverse().map((item, index) => (
                    <div
                        key={index}
                        className="grid grid-cols-3 px-2 py-1.5 text-xs font-mono border-b border-white/5 last:border-0 hover:bg-white/5 rounded transition-colors"
                    >
                        <span className="text-gray-500">{item.time}</span>
                        <span
                            className={`text-right font-bold ${
                                index === 0 ? "text-white" : "text-gray-300"
                            }`}
                        >
                            {item.price.toFixed(2)}
                        </span>
                        <span className="text-right text-cyan-500/70">
                            {item.volume}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
