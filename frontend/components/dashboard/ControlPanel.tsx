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
        <div className="lg:col-span-5 bg-[#15151A] border border-gray-800 rounded-2xl p-6 h-full">
            <div className="flex items-center justify-between mb-6">
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

            <div className="space-y-6">
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
                                    : "text-green-400"
                            }`}
                        >
                            {features.rsi.toFixed(0)}
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
                            {features.volatility.toFixed(0)}
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
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[#0E0E12] p-2 rounded border border-gray-800">
                        <label className="text-[10px] text-gray-500 block mb-1">
                            Weekly Avg (SMA 7)
                        </label>
                        <input
                            type="number"
                            name="sma_7"
                            value={features.sma_7}
                            onChange={handleManualChange}
                            className="w-full bg-transparent text-sm font-mono outline-none text-white"
                        />
                    </div>
                    <div className="bg-[#0E0E12] p-2 rounded border border-gray-800">
                        <label className="text-[10px] text-gray-500 block mb-1">
                            Yesterday Price
                        </label>
                        <input
                            type="number"
                            name="price_lag_1"
                            value={features.price_lag_1}
                            onChange={handleManualChange}
                            className="w-full bg-transparent text-sm font-mono outline-none text-white"
                        />
                    </div>
                </div>

                <button
                    onClick={onPredict}
                    className="w-full mt-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-cyan-900/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                    <Zap size={18} fill="currentColor" /> RUN SCENARIO
                </button>
            </div>
        </div>
    );
}
