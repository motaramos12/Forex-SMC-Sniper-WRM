
import React, { useState, useMemo } from 'react';
import type { HistoricalTrade } from '../types';
import { AVAILABLE_SYMBOLS } from '../constants';
import { BookOpenIcon, PencilIcon, StarIcon, StarSolidIcon, XIcon, CheckCircleIcon } from './icons';

// --- Sub-component for Modal ---
interface TradeJournalDetailModalProps {
  trade: HistoricalTrade;
  onClose: () => void;
  onSave: (tradeId: string, notes: string) => void;
}

const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
  <div className="flex">
    {[...Array(5)].map((_, i) => (
      i < rating 
        ? <StarSolidIcon key={i} className="w-5 h-5 text-amber-400" /> 
        : <StarIcon key={i} className="w-5 h-5 text-amber-400" />
    ))}
  </div>
);

const TradeJournalDetailModal: React.FC<TradeJournalDetailModalProps> = ({ trade, onClose, onSave }) => {
  const [notes, setNotes] = useState(trade.notes || '');

  const handleSave = () => {
    onSave(trade.id, notes);
    onClose();
  };
  
  const isWin = trade.result === 'Win';

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-700 animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-slate-900/70 backdrop-blur-sm z-10 p-5 border-b border-slate-800 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-100">{trade.pair}</h2>
            <p className="text-sm text-slate-400">{trade.closeDate.toLocaleString('pt-BR')}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:bg-slate-700 hover:text-white"
          >
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
             <div className="bg-slate-800 p-3 rounded-lg">
                <p className="text-xs text-slate-400 uppercase">Resultado</p>
                <p className={`text-lg font-bold ${isWin ? 'text-green-400' : 'text-red-400'}`}>{isWin ? 'Vitória' : 'Derrota'}</p>
            </div>
             <div className="bg-slate-800 p-3 rounded-lg">
                <p className="text-xs text-slate-400 uppercase">L/P</p>
                <p className={`text-lg font-bold font-mono ${isWin ? 'text-green-400' : 'text-red-400'}`}>${trade.profitOrLoss.toFixed(2)}</p>
            </div>
            <div className="bg-slate-800 p-3 rounded-lg">
                <p className="text-xs text-slate-400 uppercase">Confluências</p>
                <div className="flex items-center justify-center mt-1 text-cyan-400">
                    <CheckCircleIcon className="w-4 h-4 mr-1.5" />
                    <span className="text-lg font-bold">{trade.confluenceCount || 'N/A'}</span>
                </div>
            </div>
             <div className="bg-slate-800 p-3 rounded-lg">
                <p className="text-xs text-slate-400 uppercase">Setup</p>
                <div className="flex justify-center mt-1"><StarRating rating={trade.setupQuality || 0} /></div>
            </div>
             <div className="bg-slate-800 p-3 rounded-lg">
                <p className="text-xs text-slate-400 uppercase">Execução</p>
                 <div className="flex justify-center mt-1"><StarRating rating={trade.executionQuality || 0} /></div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-slate-100 mb-2">Anotações da Negociação</h3>
            <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Adicione suas anotações aqui... O que você aprendeu? O que poderia ter feito melhor?"
                className="w-full h-40 bg-slate-900/70 border border-slate-600 rounded-md p-3 text-slate-100 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 resize-none transition"
            />
          </div>

          <div className="flex justify-end space-x-4">
              <button onClick={onClose} className="px-4 py-2 text-slate-300 hover:text-white">Cancelar</button>
              <button onClick={handleSave} className="px-6 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-lg transition-colors">Salvar</button>
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


// --- Main View Component ---
interface JournalViewProps {
    trades: HistoricalTrade[];
    onUpdateTradeNotes: (tradeId: string, notes: string) => void;
}

const StarRatingDisplay: React.FC<{ rating?: number }> = ({ rating = 0 }) => (
    <div className="flex">
      {[...Array(5)].map((_, i) =>
        i < rating ? (
          <StarSolidIcon key={i} className="w-4 h-4 text-amber-400" />
        ) : (
          <StarIcon key={i} className="w-4 h-4 text-slate-600" />
        )
      )}
    </div>
  );

export const JournalView: React.FC<JournalViewProps> = ({ trades, onUpdateTradeNotes }) => {
    const [pairFilter, setPairFilter] = useState('All');
    const [resultFilter, setResultFilter] = useState('All');
    const [selectedTrade, setSelectedTrade] = useState<HistoricalTrade | null>(null);

    const filteredTrades = useMemo(() => {
        return trades
            .filter(trade => pairFilter === 'All' || trade.pair === pairFilter)
            .filter(trade => resultFilter === 'All' || trade.result === resultFilter);
    }, [trades, pairFilter, resultFilter]);

    const stats = useMemo(() => {
        const totalTrades = filteredTrades.length;
        if (totalTrades === 0) {
            return { totalPnl: 0, winRate: 0, wins: 0, losses: 0 };
        }
        const wins = filteredTrades.filter(t => t.result === 'Win').length;
        const totalPnl = filteredTrades.reduce((acc, trade) => acc + trade.profitOrLoss, 0);
        const winRate = (wins / totalTrades) * 100;
        return {
            totalPnl,
            winRate,
            wins,
            losses: totalTrades - wins,
        };
    }, [filteredTrades]);

    return (
        <div className="animate-fade-in">
            <div className="flex items-center mb-8 border-b border-slate-700 pb-4">
                <BookOpenIcon className="w-8 h-8 text-sky-400 mr-4" />
                <div>
                    <h2 className="text-3xl font-bold text-slate-100">Diário de Negociações</h2>
                    <p className="text-slate-400">Analise seu desempenho e adicione anotações às suas negociações.</p>
                </div>
            </div>

            <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/80 rounded-xl p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="pairHistoryFilter" className="block text-sm font-medium text-slate-300 mb-1">Filtrar por Par</label>
                        <select
                            id="pairHistoryFilter"
                            value={pairFilter}
                            onChange={(e) => setPairFilter(e.target.value)}
                            className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-slate-100 focus:ring-2 focus:ring-sky-500 transition"
                        >
                            <option value="All">Todos os Pares</option>
                            {AVAILABLE_SYMBOLS.map(pair => <option key={pair} value={pair}>{pair}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="resultHistoryFilter" className="block text-sm font-medium text-slate-300 mb-1">Filtrar por Resultado</label>
                        <select
                            id="resultHistoryFilter"
                            value={resultFilter}
                            onChange={(e) => setResultFilter(e.target.value)}
                             className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-slate-100 focus:ring-2 focus:ring-sky-500 transition"
                        >
                            <option value="All">Todos os Resultados</option>
                            <option value="Win">Vitória</option>
                            <option value="Loss">Derrota</option>
                        </select>
                    </div>
                </div>
            </div>

             <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 text-center">
                <div className="bg-slate-800 p-4 rounded-lg">
                    <p className="text-sm text-slate-400">Lucro/Prejuízo Total</p>
                    <p className={`text-2xl font-bold ${stats.totalPnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        ${stats.totalPnl.toFixed(2)}
                    </p>
                </div>
                <div className="bg-slate-800 p-4 rounded-lg">
                    <p className="text-sm text-slate-400">Taxa de Vitória</p>
                    <p className="text-2xl font-bold text-sky-400">{stats.winRate.toFixed(1)}%</p>
                </div>
                 <div className="bg-slate-800 p-4 rounded-lg">
                    <p className="text-sm text-slate-400">Vitórias</p>
                    <p className="text-2xl font-bold text-green-400">{stats.wins}</p>
                </div>
                <div className="bg-slate-800 p-4 rounded-lg">
                    <p className="text-sm text-slate-400">Derrotas</p>
                    <p className="text-2xl font-bold text-red-400">{stats.losses}</p>
                </div>
            </div>

            <div className="bg-slate-800/40 border border-slate-700/80 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-700">
                        <thead className="bg-slate-800/60">
                            <tr>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Data</th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Par</th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Resultado</th>
                                <th scope="col" className="hidden md:table-cell px-4 py-3 text-center text-xs font-medium text-slate-300 uppercase tracking-wider">Confluências</th>
                                <th scope="col" className="hidden md:table-cell px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Setup</th>
                                <th scope="col" className="hidden md:table-cell px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Execução</th>
                                <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-slate-300 uppercase tracking-wider">L/P ($)</th>
                                <th scope="col" className="relative px-4 py-3"><span className="sr-only">Ações</span></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {filteredTrades.map(trade => (
                                <tr key={trade.id} className="hover:bg-slate-800/70">
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-400">{trade.closeDate.toLocaleDateString('pt-BR')}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-slate-100">{trade.pair}</td>
                                    <td className="px-4 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            trade.result === 'Win' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                                        }`}>
                                            {trade.result === 'Win' ? 'Vitória' : 'Derrota'}
                                        </span>
                                    </td>
                                    <td className="hidden md:table-cell px-4 py-4 whitespace-nowrap text-sm text-slate-300 text-center">{trade.confluenceCount || 'N/A'}</td>
                                    <td className="hidden md:table-cell px-4 py-4 whitespace-nowrap"><StarRatingDisplay rating={trade.setupQuality} /></td>
                                    <td className="hidden md:table-cell px-4 py-4 whitespace-nowrap"><StarRatingDisplay rating={trade.executionQuality} /></td>
                                    <td className={`px-4 py-4 whitespace-nowrap text-sm text-right font-mono ${
                                        trade.profitOrLoss >= 0 ? 'text-green-400' : 'text-red-400'
                                    }`}>
                                        ${trade.profitOrLoss.toFixed(2)}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => setSelectedTrade(trade)} className="text-sky-400 hover:text-sky-300 p-1 rounded-full" title="Editar Anotações">
                                            <PencilIcon className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredTrades.length === 0 && (
                    <div className="text-center py-10 text-slate-400">
                        Nenhuma negociação encontrada para os filtros selecionados.
                    </div>
                )}
            </div>
            {selectedTrade && (
                <TradeJournalDetailModal
                    trade={selectedTrade}
                    onClose={() => setSelectedTrade(null)}
                    onSave={onUpdateTradeNotes}
                />
            )}
        </div>
    );
};
