import React, { useState, useEffect, useMemo } from 'react';
import type { CorrelationMatrixData } from '../types';
import { getCorrelationMatrix } from '../services/correlationService';
import { LinkIcon, RefreshCwIcon } from './icons';

interface CorrelationMatrixViewProps {
    watchlist: Set<string>;
}

const getCorrelationColor = (value: number): string => {
    if (value >= 0.7) return 'bg-green-700/80';
    if (value >= 0.4) return 'bg-green-800/70';
    if (value > -0.4) return 'bg-slate-700/50';
    if (value > -0.7) return 'bg-red-800/70';
    return 'bg-red-700/80';
};

export const CorrelationMatrixView: React.FC<CorrelationMatrixViewProps> = ({ watchlist }) => {
    const [matrixData, setMatrixData] = useState<CorrelationMatrixData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const watchlistArray = useMemo(() => Array.from(watchlist), [watchlist]);

    useEffect(() => {
        const fetchCorrelationData = async () => {
            if (watchlistArray.length < 2) {
                setMatrixData(null);
                setIsLoading(false);
                return;
            }
            setIsLoading(true);
            const data = await getCorrelationMatrix(watchlistArray);
            setMatrixData(data);
            setIsLoading(false);
        };

        fetchCorrelationData();
    }, [watchlistArray]);

    return (
        <div className="animate-fade-in">
            <div className="flex items-center mb-8 border-b border-slate-700 pb-4">
                <LinkIcon className="w-8 h-8 text-sky-400 mr-4" />
                <div>
                    <h2 className="text-3xl font-bold text-slate-100">Matriz de Correlação</h2>
                    <p className="text-slate-400">Analise a correlação entre os pares em sua watchlist.</p>
                </div>
            </div>

            {isLoading ? (
                 <div className="flex flex-col items-center justify-center h-96 bg-slate-800/40 border border-slate-700/80 rounded-xl">
                    <RefreshCwIcon className="w-10 h-10 text-sky-500 animate-spin" />
                    <p className="mt-4 text-slate-300">Calculando correlações...</p>
                </div>
            ) : !matrixData || watchlistArray.length < 2 ? (
                <div className="flex flex-col items-center justify-center h-96 bg-slate-800/40 border border-slate-700/80 rounded-xl text-center p-4">
                    <LinkIcon className="w-16 h-16 text-slate-600 mb-4" />
                    <h3 className="text-xl font-bold text-slate-100 mb-2">Dados Insuficientes</h3>
                    <p className="text-slate-400 max-w-sm">
                        Adicione pelo menos dois pares à sua watchlist para calcular a matriz de correlação.
                    </p>
                </div>
            ) : (
                <div className="bg-slate-800/40 border border-slate-700/80 rounded-xl overflow-x-auto p-4">
                    <table className="min-w-full text-center border-separate border-spacing-1">
                        <thead>
                            <tr>
                                <th className="p-2"></th>
                                {watchlistArray.map(pair => (
                                    <th key={pair} className="p-2 text-sm font-bold text-slate-300">
                                        {pair}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {watchlistArray.map(pair1 => (
                                <tr key={pair1}>
                                    <td className="p-2 text-sm font-bold text-slate-300 text-right">{pair1}</td>
                                    {watchlistArray.map(pair2 => {
                                        const correlation = matrixData[pair1]?.[pair2] ?? 0;
                                        const color = getCorrelationColor(correlation);
                                        return (
                                            <td key={`${pair1}-${pair2}`} className={`p-3 rounded-md ${color}`}>
                                                <span className="font-mono text-base font-semibold text-white">
                                                    {correlation.toFixed(2)}
                                                </span>
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                     <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-400">
                        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-green-700/80"></span> Forte Positiva (&gt;0.7)</div>
                        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-green-800/70"></span> Positiva (0.4-0.7)</div>
                        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-slate-700/50"></span> Neutra (-0.4-0.4)</div>
                        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-red-800/70"></span> Negativa (-0.7- -0.4)</div>
                        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-red-700/80"></span> Forte Negativa (&lt;-0.7)</div>
                    </div>
                </div>
            )}
        </div>
    );
};
