import { Zap, Sliders } from "lucide-react";

interface ControlPanelProps {
    features: any;
    handleManualChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onPredict: () => void;
}

export default function ControlPanel({
    features,
    handleManualChange,
    onPredict,
}: ControlPanelProps) {
    return (
<div className="lg:col-span-5 bg-[#15151A] border border-gray-800 rounded-2xl p-4 lg:p-6 flex flex-col overflow-hidden min-h-[480px] lg:min-h-0 lg:h-full">            
            {/* HEADER */}
            <div className="flex items-center justify-between mb-6 shrink-0">
                <div className="flex items-center gap-2 text-cyan-400">
                    <Sliders size={18} />
                    <h3 className="font-bold text-sm uppercase">
                        Simulate Scenarios
                    </h3>
                </div>
                <span className="text-[10px] text-gray-500 border border-gray-700 px-2 py-1 rounded">
                    EDITABLE
                </span>
            </div>

            {/* CONTROLES */}
            <div className="flex-1 flex flex-col justify-center gap-8">
                
                {/* RSI SLIDER */}
                <div>
                    <div className="flex justify-between mb-2">
                        <label className="text-[10px] text-gray-400 font-bold uppercase">
                            RSI (Momentum)
                        </label>
                        <span
                            className={`text-xs font-mono font-bold ${
                                features.rsi > 70
                                    ? "text-red-400"
                                    : features.rsi < 30 
                                    ? "text-green-400" 
                                    : "text-cyan-400"
                            }`}
                        >
                            {Number(features.rsi).toFixed(0)}
                        </span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        name="rsi"
                        value={features.rsi}
                        onChange={handleManualChange}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                    />
                    <div className="flex justify-between text-[10px] text-gray-600 mt-1">
                        <span>Oversold (Buy)</span>
                        <span>Overbought (Sell)</span>
                    </div>
                </div>

                {/* VOLATILITY SLIDER */}
                <div>
                    <div className="flex justify-between mb-2">
                        <label className="text-[10px] text-gray-400 font-bold uppercase">
                            Volatility (Risk)
                        </label>
                        <span className="text-xs font-mono text-white">
                            {Number(features.volatility).toFixed(0)}
                        </span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="5000"
                        name="volatility"
                        value={features.volatility}
                        onChange={handleManualChange}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                    />
                </div>

                {/* NUMERIC INPUTS */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#0E0E12] p-3 rounded-lg border border-gray-800 focus-within:border-gray-600 transition-colors">
                        <label className="text-[10px] text-gray-500 uppercase font-bold block mb-1">
                            Weekly Average
                        </label>
                        <input
                            type="number"
                            step="0.01" 
                            name="sma_7"
                            value={features.sma_7.toFixed(2)}
                            onChange={handleManualChange}
                            className="w-full bg-transparent text-sm font-mono outline-none text-white placeholder-gray-700"
                            placeholder="0.00"
                        />
                    </div>
                    <div className="bg-[#0E0E12] p-3 rounded-lg border border-gray-800 focus-within:border-gray-600 transition-colors">
                        <label className="text-[10px] text-gray-500 uppercase font-bold block mb-1">
                            Yesterday Price
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            name="price_lag_1"
                            value={features.price_lag_1.toFixed(2)}
                            onChange={handleManualChange}
                            className="w-full bg-transparent text-sm font-mono outline-none text-white placeholder-gray-700"
                            placeholder="0.00"
                        />
                    </div>
                </div>
            </div>

            <div className="mt-6 pt-2 shrink-0">
                <button
                    onClick={onPredict}
                    className="group w-full bg-cyan-500/10 border border-cyan-500/50 hover:bg-cyan-500/20 text-cyan-400 hover:text-cyan-300 font-mono font-bold py-3.5 rounded-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 uppercase tracking-wider text-xs cursor-pointer ]"
                >
                    <Zap
                        size={16}
                        className="group-hover:text-cyan-200 transition-colors"
                    />
                    Run Simulation
                </button>
            </div>
        </div>
    );
}