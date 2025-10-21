
import React from 'react';
import type { EconomicEvent } from '../types';
import { XIcon, RefreshCwIcon, TrendingUpIcon, TrendingDownIcon, ZapIcon } from './icons';

interface EconomicEventDetailModalProps {
  event: EconomicEvent;
  onClose: () => void;
  isLoading: boolean;
}

const getCurrencyFlag = (currency: string) => `https://flagcdn.com/w40/${currency.slice(0, 2).toLowerCase()}.png`;

const VolatilityTag: React.FC<{ rating?: string }> = ({ rating }) => {
    const styles = {
        High: 'bg-amber-500/10 text-amber-400',
        'Very High': 'bg-orange-500/10 text-orange-400',
        Extreme: 'bg-red-500/10 text-red-400',
    };
    const selectedStyle = rating ? styles[rating as keyof typeof styles] : 'bg-slate-700 text-slate-400';
    return (
        <div className={`flex items-center space-x-2 px-3 py-1 text-sm font-semibold rounded-full ${selectedStyle}`}>
            <ZapIcon className="w-4 h-4" />
            <span>{rating || 'N/A'}</span>
        </div>
    );
};

export const EconomicEventDetailModal: React.FC<EconomicEventDetailModalProps> = ({ event, onClose, isLoading }) => {
  const { name, currency, date, actual, forecast, previous, aiAnalysis } = event;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-slate-700 animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-slate-900/70 backdrop-blur-sm z-10 p-5 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center">
             <img src={getCurrencyFlag(currency)} alt={currency} className="w-10 h-10 rounded-full mr-4" />
             <div>
                <h2 className="text-2xl font-bold text-slate-100">{name}</h2>
                <p className="text-sm text-slate-400">{date.toLocaleString('pt-BR', { dateStyle: 'full', timeStyle: 'short' })}</p>
             </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:bg-slate-700 hover:text-white"
          >
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6">
            <div className="grid grid-cols-3 gap-4 text-center mb-8">
                <div className="bg-slate-800 p-3 rounded-lg">
                    <p className="text-sm text-slate-400">Atual</p>
                    <p className="text-2xl font-bold font-mono text-slate-100">{actual || '–'}</p>
                </div>
                <div className="bg-slate-800 p-3 rounded-lg">
                    <p className="text-sm text-slate-400">Previsão</p>
                    <p className="text-2xl font-bold font-mono text-sky-400">{forecast || '–'}</p>
                </div>
                <div className="bg-slate-800 p-3 rounded-lg">
                    <p className="text-sm text-slate-400">Anterior</p>
                    <p className="text-2xl font-bold font-mono text-slate-500">{previous || '–'}</p>
                </div>
            </div>

            <div className="border-t border-slate-700 pt-6">
                <h3 className="text-xl font-semibold text-slate-100 mb-4 text-center">Análise de IA e Previsão de Impacto</h3>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-64">
                        <RefreshCwIcon className="w-8 h-8 text-sky-500 animate-spin" />
                        <p className="mt-4 text-slate-300">Gerando análise preditiva...</p>
                    </div>
                ) : aiAnalysis ? (
                    <div className="space-y-6">
                        <div className="bg-slate-800/60 p-4 rounded-lg border border-slate-700">
                             <h4 className="font-semibold text-md text-slate-300 mb-2">O que é este evento?</h4>
                             <p className="text-slate-300 leading-relaxed text-sm">{aiAnalysis.explanation}</p>
                        </div>
                        
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div className="bg-green-500/10 p-4 rounded-lg border border-green-500/20">
                                <div className="flex items-center mb-2">
                                    <TrendingUpIcon className="w-6 h-6 text-green-400 mr-3" />
                                    <h4 className="font-bold text-lg text-green-400">Cenário Bullish ({currency} Forte)</h4>
                                </div>
                                <p className="text-slate-300 leading-relaxed text-sm">{aiAnalysis.bullishImpact}</p>
                            </div>
                             <div className="bg-red-500/10 p-4 rounded-lg border border-red-500/20">
                                 <div className="flex items-center mb-2">
                                    <TrendingDownIcon className="w-6 h-6 text-red-400 mr-3" />
                                    <h4 className="font-bold text-lg text-red-400">Cenário Bearish ({currency} Fraco)</h4>
                                </div>
                                <p className="text-slate-300 leading-relaxed text-sm">{aiAnalysis.bearishImpact}</p>
                            </div>
                        </div>

                         <div className="flex flex-col items-center justify-center text-center bg-slate-800/60 p-4 rounded-lg border border-slate-700">
                             <h4 className="font-semibold text-md text-slate-300 mb-3">Volatilidade Esperada</h4>
                             <VolatilityTag rating={aiAnalysis.volatilityRating} />
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-10 text-slate-500">
                        <p>Não foi possível carregar a análise de IA.</p>
                    </div>
                )}
            </div>
        </div>

      </div>
       <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};
