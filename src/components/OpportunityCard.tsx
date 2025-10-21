
import React, { useMemo } from 'react';
import type { TradeOpportunity, EconomicEvent } from '../types';
import { PIP_VALUE_MULTIPLIER } from '../constants';
import { BellIcon, BellSolidIcon, SendIcon, AlertTriangleIcon, StarIcon, StarSolidIcon, ZapIcon, CheckCircleIcon } from './icons';
import { formatPrice, getRiskLabel, getSymbolType } from '../constants';

interface OpportunityCardProps {
  opportunity: TradeOpportunity;
  onSelect: (opportunity: TradeOpportunity) => void;
  onToggleAlert: (opportunityId: string, pair: string) => void;
  onToggleFavorite: (opportunityId: string) => void;
  onSendToTelegram: (opportunity: TradeOpportunity) => void;
  isAlertActive: boolean;
  isFavorite: boolean;
  economicEvents: EconomicEvent[];
}

export const OpportunityCard: React.FC<OpportunityCardProps> = ({ 
    opportunity, 
    onSelect, 
    onToggleAlert,
    onToggleFavorite, 
    onSendToTelegram, 
    isAlertActive,
    isFavorite, 
    economicEvents 
}) => {
  const { pair, bias, entryPrice, stopLoss, takeProfit, setupTimeframe, analysis } = opportunity;

  const isBullish = bias === 'Bullish';
  const signalText = isBullish ? 'SINAL DE COMPRA' : 'SINAL DE VENDA';
  const biasTextColor = isBullish ? 'text-green-400' : 'text-red-400';
  const biasBgColor = isBullish ? 'bg-green-500/10' : 'bg-red-500/10';

  const multiplier = PIP_VALUE_MULTIPLIER[pair] || PIP_VALUE_MULTIPLIER['default'];
  const symbolType = getSymbolType(pair);
  
  const setupAnalysis = useMemo(() => analysis.find(a => a.timeframe === setupTimeframe), [analysis, setupTimeframe]);
  const confluenceCount = setupAnalysis ? setupAnalysis.findings.length : 0;

  const pipsToSl = Math.abs(entryPrice - stopLoss) * multiplier;
  const pipsToTp = Math.abs(takeProfit - entryPrice) * multiplier;
  const rr = pipsToSl > 0 ? (pipsToTp / pipsToSl) : 0;

  const relevantHighImpactEvent = useMemo(() => {
    if (!economicEvents || symbolType !== 'forex') return null;
    const currencies = pair.split('/');
    const now = new Date();
    const next24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    return economicEvents.find(event =>
        (currencies.includes(event.currency)) &&
        event.impact === 'High' &&
        event.date > now &&
        event.date <= next24Hours
    );
  }, [economicEvents, pair, symbolType]);

  const handleAlertClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleAlert(opportunity.id, opportunity.pair);
  };

  const handleSendClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSendToTelegram(opportunity);
  };
  
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(opportunity.id);
  };

  return (
    <div
      onClick={() => onSelect(opportunity)}
      className={`relative bg-slate-800/40 border ${isFavorite ? 'border-amber-400/60' : 'border-slate-700'} rounded-xl shadow-lg hover:border-sky-500/80 transition-all duration-300 cursor-pointer group animate-fade-in`}
    >
      <div className="p-5">
        <div className="flex justify-between items-start">
            <div>
                <div className="flex items-center gap-3">
                    <h3 className="text-2xl font-bold text-slate-100">{pair}</h3>
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${biasBgColor} ${biasTextColor}`}>{signalText}</span>
                </div>
                 <div className="flex items-center gap-3 mt-1 text-xs">
                    <span className="font-mono bg-slate-700 text-sky-300 px-2 py-0.5 rounded">
                        {setupTimeframe}
                    </span>
                    <div className="flex items-center gap-1 text-cyan-400" title={`${confluenceCount} confluências de SMC`}>
                        <CheckCircleIcon className="w-4 h-4" />
                        <span className="font-medium">{confluenceCount} Confluências</span>
                    </div>
                    {symbolType !== 'forex' && (
                        <div className="flex items-center gap-1 text-purple-400" title="Instrumento de Alta Volatilidade">
                            <ZapIcon className="w-4 h-4" />
                            <span className="font-medium">Volátil</span>
                        </div>
                    )}
                    {relevantHighImpactEvent && (
                        <div className="flex items-center gap-1 text-amber-400" title={`Notícia de Alto Impacto: ${relevantHighImpactEvent.name}`}>
                            <AlertTriangleIcon className="w-4 h-4" />
                            <span className="font-medium">Notícia</span>
                        </div>
                    )}
                 </div>
            </div>
             <div className="flex items-center space-x-1">
                <button
                    onClick={handleFavoriteClick}
                    className="p-2 text-slate-400 rounded-full hover:bg-slate-700 hover:text-amber-400 transition-colors"
                    title={isFavorite ? "Remover dos Favoritos" : "Adicionar aos Favoritos"}
                >
                    {isFavorite ? <StarSolidIcon className="w-5 h-5 text-amber-400" /> : <StarIcon className="w-5 h-5" />}
                </button>
                <button
                    onClick={handleAlertClick}
                    className="p-2 text-slate-400 rounded-full hover:bg-slate-700 hover:text-amber-400 transition-colors"
                    title={isAlertActive ? "Remover Alerta" : "Definir Alerta"}
                >
                    {isAlertActive ? <BellSolidIcon className="w-5 h-5 text-amber-400" /> : <BellIcon className="w-5 h-5" />}
                </button>
                 <button
                    onClick={handleSendClick}
                    className="p-2 text-slate-400 rounded-full hover:bg-slate-700 hover:text-cyan-400 transition-colors"
                    title="Enviar para Telegram"
                >
                    <SendIcon className="w-5 h-5" />
                </button>
            </div>
        </div>
        
        <div className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between items-baseline">
                <span className="text-slate-400">Entrada:</span>
                <span className="font-mono text-slate-100 text-base">{formatPrice(pair, entryPrice)}</span>
            </div>
             <div className="flex justify-between items-baseline">
                <span className="text-slate-400">Risco (SL):</span>
                <span
                    className="font-mono text-red-400 underline decoration-dotted cursor-help"
                    title={`Preço SL: ${formatPrice(pair, stopLoss)}`}
                >
                    {pipsToSl.toFixed(1)} {getRiskLabel(pair)}
                </span>
            </div>
            <div className="flex justify-between items-baseline">
                <span className="text-slate-400">Lucro (TP):</span>
                 <span
                    className="font-mono text-green-400 underline decoration-dotted cursor-help"
                    title={`Preço TP: ${formatPrice(pair, takeProfit)}`}
                >
                    {pipsToTp.toFixed(1)} {getRiskLabel(pair)}
                </span>
            </div>
        </div>

        <div className="mt-6 bg-slate-900/50 rounded-lg p-3 flex justify-between items-center">
            <span className="text-slate-300 text-sm font-medium">Risco/Retorno:</span>
            <span className="text-sky-400 font-bold text-lg">1:{rr.toFixed(1)}</span>
        </div>
      </div>
    </div>
  );
};
