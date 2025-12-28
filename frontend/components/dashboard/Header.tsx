import { RefreshCw } from "lucide-react";

interface HeaderProps {
    isLive: boolean;
    setIsLive: (val: boolean) => void;
    onReset: () => void;
}

export default function Header({ isLive, setIsLive, onReset }: HeaderProps) {
    return (
        <header className="h-16 border-b border-gray-800 flex items-center justify-between px-4 md:px-8 bg-[#0E0E12]/95 backdrop-blur sticky top-0 z-50 transition-all">
            
            <div className="flex items-center gap-2 md:gap-4">
                <div
                    className={`w-2 h-2 rounded-full shrink-0 ${
                        isLive ? "bg-green-500 animate-pulse" : "bg-red-500"
                    }`}
                ></div>
                <span className="font-mono text-sm text-gray-400 hidden sm:block">
                    BTC/USD SIMULATOR MODE
                </span>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
                
                <div
                    className="flex items-center gap-2 md:gap-3 px-1 py-1 pr-2 md:pr-4 cursor-pointer hover:border-gray-700 transition-colors"
                    onClick={() => setIsLive(!isLive)}
                >
                    {/* Track */}
                    <div
                        className={`
                        w-8 h-5 md:w-10 md:h-6 rounded-full p-1 transition-colors duration-300 ease-in-out relative
                        flex items-center 
                        ${
                            isLive
                                ? "bg-green-900/40 border border-green-500/30"
                                : "bg-gray-800 border border-gray-700"
                        }
                    `}
                    >
                        <div
                            className={`
                            w-3 h-3 md:w-4 md:h-4 bg-white rounded-full shadow-md transform transition-transform duration-300
                            ${
                                isLive
                                    ? "translate-x-3 md:translate-x-4 bg-green-400"
                                    : "translate-x-0 bg-gray-400"
                            }
                        `}
                        />
                    </div>
                    
                    <span
                        className={`text-[10px] md:text-xs font-bold font-mono ${
                            isLive ? "text-green-400" : "text-gray-400"
                        }`}
                    >
                        {isLive ? "LIVE" : "PAUSED"} 
                    </span>
                </div>

                <div className="h-4 md:h-6 w-px bg-gray-800 mx-1 md:mx-2"></div>

                {/* BOTÓN RESET */}
                <button
                    onClick={onReset}
                    className="group flex items-center gap-2 px-2 md:px-3 py-1.5 rounded-lg text-gray-400 hover:text-white transition-all text-xs font-medium cursor-pointer"
                    title="Reset Data"
                >
                    <RefreshCw
                        size={14}
                        className={`group-hover:rotate-180 transition-transform duration-500 ${
                            !isLive && "text-amber-500"
                        }`}
                    />
                    <span className="hidden sm:inline">Reset Data</span>
                </button>
            </div>
        </header>
    );
}