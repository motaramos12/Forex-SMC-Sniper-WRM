
import React, { useState } from 'react';
import type { MarketAnalysisData } from '../types';
import { AVAILABLE_SYMBOLS } from '../constants';
import { ChevronRightIcon, XIcon } from './icons';

interface MarketAnalysisProps {
    analysisData: MarketAnalysisData;
    onClose: () => void;
}

export const MarketAnalysis: React.FC<MarketAnalysisProps> = ({ analysisData, onClose }) => {
    const [selectedPair, setSelectedPair] = useState<string>(AVAILABLE_SYMBOLS[0]);

    const pairData = analysisData[selectedPair];
    const isBullish = pairData?.bias === 'Bullish';

    return (
        <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/80 rounded-xl p-4 md:p-6 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-slate-100">Análise de Mercado</h2>
                <button
                    onClick={onClose}
                    className="p-2 rounded-full text-slate-400 hover:bg-slate-700 hover:text-white"
                    title="Fechar Análise"
                >
                    <XIcon className="w-6 h-6" />
                </button>
            </div>

            <div className="flex flex-wrap items-center border-b border-slate-700 mb-6 -mx-4 px-4">
                {AVAILABLE_SYMBOLS.map(pair => (
                    <button
                        key={pair}
                        onClick={() => setSelectedPair(pair)}
                        className={`px-4 py-3 text-sm font-medium transition-colors duration-200 border-b-2 ${
                            selectedPair === pair 
                            ? 'text-sky-400 border-sky-400' 
                            : 'text-slate-400 border-transparent hover:text-white hover:border-slate-500'
                        }`}
                    >
                        {pair}
                    </button>
                ))}
            </div>

            {pairData && (
                <div>
                    <div className="mb-6 flex items-center gap-3">
                        <h3 className="text-2xl font-bold text-slate-100">{selectedPair}</h3>
                        <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                            isBullish ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                        }`}>
                            Viés Geral: {pairData.bias}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {pairData.analysis.map(tfAnalysis => (
                             <div key={tfAnalysis.timeframe} className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                                 <p className="font-bold text-lg text-slate-100 mb-3 pb-2 border-b border-slate-700">{tfAnalysis.timeframe}</p>
                                 <ul className="space-y-2">
                                     {tfAnalysis.findings.map(finding => (
                                         <li key={finding.id} className="flex items-start">
                                             <ChevronRightIcon className={`w-4 h-4 ${isBullish ? 'text-green-500' : 'text-red-500'} mt-1 mr-2 flex-shrink-0`} />
                                             <span className="text-slate-300 text-sm">{finding.description}</span>
                                         </li>
                                     ))}
                                 </ul>
                             </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
