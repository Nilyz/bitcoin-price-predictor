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
        <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
        <span className="font-mono text-sm text-gray-400">BTC/USD SIMULATOR MODE</span>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsLive(!isLive)}
          className={`px-4 py-1 rounded border text-xs font-bold transition-all ${
            isLive ? 'border-green-500 text-green-500 bg-green-900/20' : 'border-gray-600 text-gray-400'
          }`}
        >
          {isLive ? 'LIVE FEED ON' : 'PAUSED'}
        </button>
        <button onClick={onReset} className="p-2 hover:bg-white/10 rounded-full" title="Reset to Real Data">
          <RefreshCw size={18} />
        </button>
      </div>
    </header>
  );
}