import { RefreshCw } from "lucide-react";

interface HeaderProps {
    isLive: boolean;
    setIsLive: (val: boolean) => void;
    onReset: () => void;
}

export default function Header({ isLive, setIsLive, onReset }: HeaderProps) {
    return (
        <header className="h-16 border-b border-gray-800 flex items-center justify-between px-8 bg-[#0E0E12]/95 backdrop-blur sticky top-0 z-50">
            <div className="flex items-center gap-4">
                <div
                    className={`w-2 h-2 rounded-full ${
                        isLive ? "bg-green-500 animate-pulse" : "bg-red-500"
                    }`}
                ></div>
                <span className="font-mono text-sm text-gray-400">
                    BTC/USD SIMULATOR MODE
                </span>
            </div>

            <div className="flex items-center gap-4">
                <div
                    className="flex items-center w-35 gap-3 px-1 py-1 pr-4 cursor-pointer hover:border-gray-700 transition-colors"
                    onClick={() => setIsLive(!isLive)}
                >
                    <div
                        className={`
                        w-10 h-6 rounded-full p-1 transition-colors duration-300 ease-in-out relative
                        ${
                            isLive
                                ? "bg-green-900/40 border border-green-500/30"
                                : "bg-gray-800 border border-gray-700"
                        }
                    `}
                    >
                        <div
                            className={`
                            w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300
                            ${
                                isLive
                                    ? "translate-x-4 bg-green-400"
                                    : "translate-x-0 bg-gray-400"
                            }
                        `}
                        />
                    </div>
                    <span
                        className={`text-xs font-bold font-mono ${
                            isLive ? "text-green-400" : "text-gray-400"
                        }`}
                    >
                        {isLive ? "LIVE FEED" : "PAUSED"}
                    </span>
                </div>

                <div className="h-6 w-px bg-gray-800 mx-2"></div>

                <button
                    onClick={onReset}
                    className="group flex items-center gap-2 px-3 py-1.5 rounded-lg text-gray-400 hover:text-white transition-all text-xs font-medium cursor-pointer"
                    title="Reset to Real Data"
                >
                    <RefreshCw
                        size={14}
                        className={`group-hover:rotate-180 transition-transform duration-500 ${
                            !isLive && "text-amber-500"
                        }`}
                    />
                    <span>Reset Data</span>
                </button>
            </div>
        </header>
    );
}
