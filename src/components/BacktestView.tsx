
import React, { useState } from 'react';
import { HistoryIcon, RefreshCwIcon, CheckCircleIcon } from './icons';
import { AVAILABLE_SYMBOLS } from '../constants';
import type { BacktestParams, BacktestResult } from '../types';
import { runBacktest } from '../services/backtestService';

const MOCK_STRATEGIES = [
    'Engolfo de Alta/Baixa em Bloco de Ordens',
    'Quebra de Estrutura com Retorno ao FVG',
    'Captura de Liquidez e Reversão (ChoCH)',
];

export const BacktestView: React.FC = () => {
    const today = new Date().toISOString().split('T')[0];
    const [params, setParams] = useState<BacktestParams>({
        pair: AVAILABLE_SYMBOLS[0],
        strategy: MOCK_STRATEGIES[0],
        startDate: '2023-01-01',
        endDate: today,
        initialBalance: 10000,
        riskPercentage: 1,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<BacktestResult | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setParams(prev => ({ ...prev, [name]: name === 'initialBalance' || name === 'riskPercentage' ? parseFloat(value) : value }));
    };

    const handleRunBacktest = async () => {
        setIsLoading(true);
        setResult(null);
        const backtestResult = await runBacktest(params);
        setResult(backtestResult);
        setIsLoading(false);
    };

    return (
        <div className="animate-fade-in">
            <div className="flex items-center mb-8 border-b border-slate-700 pb-4">
                <HistoryIcon className="w-8 h-8 text-sky-400 mr-4" />
                <div>
                    <h2 className="text-3xl font-bold text-slate-100">Ferramenta de Backtest</h2>
                    <p className="text-slate-400">Teste suas estratégias de negociação contra dados históricos simulados.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Parameters Form */}
                <div className="lg:col-span-1 bg-slate-800/40 border border-slate-700/80 rounded-xl p-6 h-fit">
                    <h3 className="text-xl font-semibold text-slate-100 mb-4">Parâmetros do Teste</h3>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="pair" className="block text-sm font-medium text-slate-300 mb-1">Par de Moedas</label>
                            <select id="pair" name="pair" value={params.pair} onChange={handleInputChange} className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-slate-100 focus:ring-2 focus:ring-sky-500 transition">
                                {AVAILABLE_SYMBOLS.map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="strategy" className="block text-sm font-medium text-slate-300 mb-1">Estratégia</label>
                            <select id="strategy" name="strategy" value={params.strategy} onChange={handleInputChange} className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-slate-100 focus:ring-2 focus:ring-sky-500 transition">
                                {MOCK_STRATEGIES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="startDate" className="block text-sm font-medium text-slate-300 mb-1">Data Inicial</label>
                                <input type="date" id="startDate" name="startDate" value={params.startDate} onChange={handleInputChange} className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-slate-100 focus:ring-2 focus:ring-sky-500 transition" />
                            </div>
                            <div>
                                <label htmlFor="endDate" className="block text-sm font-medium text-slate-300 mb-1">Data Final</label>
                                <input type="date" id="endDate" name="endDate" value={params.endDate} onChange={handleInputChange} className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-slate-100 focus:ring-2 focus:ring-sky-500 transition" />
                            </div>
                        </div>
                        <button onClick={handleRunBacktest} disabled={isLoading} className="w-full flex items-center justify-center bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                            {isLoading ? <RefreshCwIcon className="w-5 h-5 animate-spin" /> : 'Executar Backtest'}
                        </button>
                    </div>
                </div>

                {/* Results View */}
                <div className="lg:col-span-2">
                    {isLoading && (
                        <div className="flex flex-col items-center justify-center h-96 bg-slate-800/40 border border-slate-700/80 rounded-xl">
                            <RefreshCwIcon className="w-10 h-10 text-sky-500 animate-spin" />
                            <p className="mt-4 text-slate-300">Executando simulação...</p>
                        </div>
                    )}
                    {!isLoading && !result && (
                         <div className="flex flex-col items-center justify-center h-96 bg-slate-800/40 border border-slate-700/80 rounded-xl text-center p-4">
                            <HistoryIcon className="w-16 h-16 text-slate-600 mb-4" />
                            <h3 className="text-xl font-bold text-slate-100 mb-2">Aguardando Simulação</h3>
                            <p className="text-slate-400 max-w-sm">
                                Configure os parâmetros à esquerda e clique em "Executar Backtest" para ver os resultados da simulação aqui.
                            </p>
                        </div>
                    )}
                    {result && (
                        <div className="space-y-6">
                            <div className="bg-slate-800/40 border border-slate-700/80 rounded-xl p-6">
                                <h3 className="text-xl font-semibold text-slate-100 mb-4">Resultados Gerais</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                                    <div className="bg-slate-800 p-3 rounded-lg">
                                        <p className="text-sm text-slate-400">Saldo Final</p>
                                        <p className={`text-xl font-bold ${result.finalBalance >= params.initialBalance ? 'text-green-400' : 'text-red-400'}`}>${result.finalBalance.toFixed(2)}</p>
                                    </div>
                                    <div className="bg-slate-800 p-3 rounded-lg">
                                        <p className="text-sm text-slate-400">Lucro/Prejuízo</p>
                                        <p className={`text-xl font-bold ${result.totalProfitLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>${result.totalProfitLoss.toFixed(2)}</p>
                                    </div>
                                    <div className="bg-slate-800 p-3 rounded-lg">
                                        <p className="text-sm text-slate-400">Taxa de Vitória</p>
                                        <p className="text-xl font-bold text-sky-400">{result.winRate.toFixed(1)}%</p>
                                    </div>
                                    <div className="bg-slate-800 p-3 rounded-lg">
                                        <p className="text-sm text-slate-400">Total de Trades</p>
                                        <p className="text-xl font-bold text-slate-100">{result.totalTrades}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-800/40 border border-slate-700/80 rounded-xl p-6">
                                <div className="flex items-center mb-4">
                                     <CheckCircleIcon className="w-6 h-6 text-cyan-400 mr-3" />
                                     <h3 className="text-xl font-semibold text-slate-100">Análise de Confluência</h3>
                                </div>
                                <table className="min-w-full text-sm text-center">
                                    <thead className="text-slate-400">
                                        <tr>
                                            <th className="py-2 px-3 font-medium">Confluências</th>
                                            <th className="py-2 px-3 font-medium">Trades</th>
                                            <th className="py-2 px-3 font-medium">Taxa de Vitória</th>
                                            <th className="py-2 px-3 font-medium">L/P Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {result.confluenceAnalysis.map(item => (
                                            <tr key={item.count} className="border-t border-slate-700">
                                                <td className="py-3 px-3 font-bold text-slate-100">{item.count}</td>
                                                <td className="py-3 px-3 text-slate-300">{item.totalTrades}</td>
                                                <td className="py-3 px-3 font-mono font-semibold text-sky-400">{item.winRate.toFixed(1)}%</td>
                                                <td className={`py-3 px-3 font-mono font-semibold ${item.totalPnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                    ${item.totalPnl.toFixed(2)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="bg-slate-800/40 border border-slate-700/80 rounded-xl p-6">
                                <h4 className="font-semibold text-md text-slate-100 mb-2">Log de Negociações</h4>
                                 <div className="max-h-80 overflow-y-auto border border-slate-700 rounded-lg">
                                    <table className="min-w-full text-sm">
                                        <thead className="bg-slate-800 sticky top-0">
                                            <tr>
                                                <th className="py-2 px-3 text-left">Data</th>
                                                <th className="py-2 px-3 text-left">Resultado</th>
                                                <th className="py-2 px-3 text-center">Confluências</th>
                                                <th className="py-2 px-3 text-right">L/P ($)</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-slate-900/50">
                                            {result.trades.map(trade => (
                                                <tr key={trade.id} className="border-t border-slate-700">
                                                    <td className="py-2 px-3 text-slate-400">{trade.closeDate.toLocaleDateString('pt-BR')}</td>
                                                    <td className={`py-2 px-3 font-semibold ${trade.result === 'Win' ? 'text-green-400' : 'text-red-400'}`}>{trade.result === 'Win' ? 'Vitória' : 'Derrota'}</td>
                                                    <td className="py-2 px-3 text-center text-slate-300">{trade.confluenceCount}</td>
                                                    <td className={`py-2 px-3 text-right font-mono ${trade.profitOrLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>{trade.profitOrLoss.toFixed(2)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                 </div>
                             </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
