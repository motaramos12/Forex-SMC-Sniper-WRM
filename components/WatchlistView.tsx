import React, { useState, useMemo, useEffect } from 'react';
import type { TradeOpportunity, MarketAnalysisData } from '../types';
import { AVAILABLE_SYMBOLS, TIMEFRAMES_ORDER } from '../constants';
import { EyeIcon, XIcon, BellIcon, BellSolidIcon } from './icons';

interface WatchlistViewProps {
    watchlist: Set<string>;
    opportunities: TradeOpportunity[];
    marketAnalysisData: MarketAnalysisData | null;
    onAddToWatchlist: (pair: string) => void;
    onRemoveFromWatchlist: (pair: string) => void;
    watchlistAlerts: Set<string>;
    onToggleWatchlistAlert: (pair: string) => void;
}

const WatchlistCard: React.FC<{
    pair: string;
    analysis: MarketAnalysisData[string] | undefined;
    opportunityCount: number;
    onRemove: (pair: string) => void;
    isAlertActive: boolean;
    onToggleAlert: (pair: string) => void;
}> = ({ pair, analysis, opportunityCount, onRemove, isAlertActive, onToggleAlert }) => {
    const isBullish = analysis?.bias === 'Bullish';
    const biasColor = isBullish ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400';
    const biasBorderColor = isBullish ? 'border-green-500/30' : 'border-red-500/30';

    const highTimeframeAnalysis = analysis?.analysis
        .filter(a => ['D1', 'H4', 'H1'].includes(a.timeframe))
        .sort((a, b) => TIMEFRAMES_ORDER.indexOf(a.timeframe) - TIMEFRAMES_ORDER.indexOf(b.timeframe));

    return (
        <div className={`bg-slate-800/40 border ${biasBorderColor} rounded-xl shadow-lg transition-all duration-300 p-5 flex flex-col justify-between`}>
            <div>
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-bold text-slate-100">{pair}</h3>
                    <div className="flex items-center space-x-1">
                        <button
                            onClick={() => onToggleAlert(pair)}
                            className="p-1 text-slate-400 rounded-full hover:bg-slate-700 hover:text-amber-400 transition-colors"
                            title={isAlertActive ? "Remover alerta de oportunidade" : "Alertar sobre novas oportunidades"}
                        >
                            {isAlertActive ? <BellSolidIcon className="w-5 h-5 text-amber-400" /> : <BellIcon className="w-5 h-5" />}
                        </button>
                        <button
                            onClick={() => onRemove(pair)}
                            className="p-1 text-slate-400 rounded-full hover:bg-slate-700 hover:text-white"
                            title="Remover da Watchlist"
                        >
                            <XIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
                <div className="space-y-3 text-sm mb-4">
                    <div className="flex justify-between items-center">
                        <span className="text-slate-400">Viés Geral:</span>
                        {analysis ? (
                             <span className={`px-2 py-1 text-xs font-semibold rounded-full ${biasColor}`}>
                                {analysis.bias}
                            </span>
                        ) : (
                            <span className="text-slate-500">N/A</span>
                        )}
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-slate-400">Oportunidades Ativas:</span>
                        <span className={`font-bold text-lg ${opportunityCount > 0 ? 'text-sky-400' : 'text-slate-500'}`}>
                            {opportunityCount}
                        </span>
                    </div>
                </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-700/50 space-y-2">
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Análise de Timeframe Alto</h4>
                {highTimeframeAnalysis && highTimeframeAnalysis.length > 0 ? (
                    highTimeframeAnalysis.map(tfAnalysis => (
                        <div key={tfAnalysis.timeframe} className="flex items-start text-xs">
                            <span className="font-bold text-slate-500 w-9 flex-shrink-0">{tfAnalysis.timeframe}:</span>
                            <p className="text-slate-400 italic">
                                {tfAnalysis.findings[0]?.description || 'N/A'}
                            </p>
                        </div>
                    ))
                ) : (
                    <p className="text-xs text-slate-500 italic">Análise de alto timeframe indisponível.</p>
                )}
            </div>
        </div>
    );
};

export const WatchlistView: React.FC<WatchlistViewProps> = ({ watchlist, opportunities, marketAnalysisData, onAddToWatchlist, onRemoveFromWatchlist, watchlistAlerts, onToggleWatchlistAlert }) => {
    const [selectedPairToAdd, setSelectedPairToAdd] = useState('');
    
    const availablePairs = useMemo(() => {
        return AVAILABLE_SYMBOLS.filter(p => !watchlist.has(p));
    }, [watchlist]);

    useEffect(() => {
        if (availablePairs.length > 0 && !availablePairs.includes(selectedPairToAdd)) {
            setSelectedPairToAdd(availablePairs[0]);
        } else if (availablePairs.length === 0) {
            setSelectedPairToAdd('');
        }
    }, [availablePairs, selectedPairToAdd]);

    const handleAddClick = () => {
        if (selectedPairToAdd) {
            onAddToWatchlist(selectedPairToAdd);
        }
    };
    
    return (
        <div className="animate-fade-in">
            <div className="flex items-center mb-8 border-b border-slate-700 pb-4">
                <EyeIcon className="w-8 h-8 text-sky-400 mr-4" />
                <div>
                    <h2 className="text-3xl font-bold text-slate-100">Watchlist</h2>
                    <p className="text-slate-400">Acompanhe seus pares de moedas e suas análises de mercado.</p>
                </div>
            </div>

            <div className="bg-slate-800/40 border border-slate-700/80 rounded-xl p-4 mb-8">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                     <label htmlFor="pairSelect" className="text-sm font-medium text-slate-300 flex-shrink-0">Adicionar Par:</label>
                     <select
                        id="pairSelect"
                        value={selectedPairToAdd}
                        onChange={(e) => setSelectedPairToAdd(e.target.value)}
                        className="w-full sm:w-auto flex-grow bg-slate-700 border border-slate-600 rounded-md p-2 text-slate-100 focus:ring-2 focus:ring-sky-500 transition"
                        disabled={availablePairs.length === 0}
                    >
                        {availablePairs.length > 0 ? (
                             availablePairs.map(pair => <option key={pair} value={pair}>{pair}</option>)
                        ) : (
                            <option>Todos os pares adicionados</option>
                        )}
                    </select>
                    <button
                        onClick={handleAddClick}
                        disabled={!selectedPairToAdd}
                        className="w-full sm:w-auto bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Adicionar
                    </button>
                </div>
            </div>

            {watchlist.size > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {Array.from(watchlist).map(pair => {
                        const pairOpportunities = opportunities.filter(op => op.pair === pair);
                        const pairAnalysis = marketAnalysisData?.[pair as string];
                        return (
                            <WatchlistCard 
                                key={pair as string}
                                pair={pair as string}
                                analysis={pairAnalysis}
                                opportunityCount={pairOpportunities.length}
                                onRemove={onRemoveFromWatchlist}
                                isAlertActive={watchlistAlerts.has(pair as string)}
                                onToggleAlert={onToggleWatchlistAlert}
                            />
                        );
                    })}
                </div>
            ) : (
                 <div className="flex flex-col items-center justify-center h-[calc(100vh-25rem)] text-center p-4">
                    <EyeIcon className="w-16 h-16 text-slate-600 mb-4" />
                    <h3 className="text-2xl font-bold text-slate-100 mb-2">Sua Watchlist está vazia</h3>
                    <p className="text-slate-400 max-w-md">
                        Use o formulário acima para adicionar pares de moedas e começar a monitorá-los.
                    </p>
                </div>
            )}
        </div>
    );
};