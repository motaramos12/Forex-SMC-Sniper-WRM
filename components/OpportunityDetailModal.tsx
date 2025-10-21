import React, { useMemo } from 'react';
import type { TradeOpportunity, EconomicEvent, ImpactLevel } from '../types';
import { RiskCalculator } from './RiskCalculator';
import { TradeChart } from './TradeChart';
import { TIMEFRAMES_ORDER } from '../constants';
import { XIcon, ChevronRightIcon, ExternalLinkIcon, SendIcon, CalendarIcon, TrendingUpIcon, TrendingDownIcon, ZapIcon, TargetIcon, LibraryIcon, EyeIcon, CheckCircleIcon } from './icons';

interface OpportunityDetailModalProps {
  opportunity: TradeOpportunity;
  onClose: () => void;
  accountBalance: number;
  riskPercentage: number;
  onSendToTelegram: (opportunity: TradeOpportunity) => void;
  economicEvents: EconomicEvent[];
}

const ImpactDot: React.FC<{ impact: ImpactLevel }> = ({ impact }) => {
    const color = {
        High: 'bg-red-500',
        Medium: 'bg-orange-400',
        Low: 'bg-yellow-400',
    }[impact];
    return <span className={`w-2.5 h-2.5 rounded-full ${color}`} title={`Impacto: ${impact}`}></span>;
};


export const OpportunityDetailModal: React.FC<OpportunityDetailModalProps> = ({
  opportunity,
  onClose,
  accountBalance,
  riskPercentage,
  onSendToTelegram,
  economicEvents,
}) => {
  const { pair, bias, analysis, setupTimeframe } = opportunity;
  const isBullish = bias === 'Bullish';
  const signalText = isBullish ? 'Sinal de Compra' : 'Sinal de Venda';

  const sortedAnalysis = [...analysis].sort((a, b) => {
    return TIMEFRAMES_ORDER.indexOf(a.timeframe) - TIMEFRAMES_ORDER.indexOf(b.timeframe);
  });
  
  const setupAnalysis = useMemo(() => sortedAnalysis.find(a => a.timeframe === setupTimeframe), [sortedAnalysis, setupTimeframe]);

  const conceptToIconMap: { [key: string]: React.FC<React.SVGProps<SVGSVGElement>> } = {
    'Higher Timeframe POI': LibraryIcon,
    'Liquidity Grab': ZapIcon,
    'Market Structure Shift (MSS)': isBullish ? TrendingUpIcon : TrendingDownIcon,
    'Fair Value Gap (FVG)': TargetIcon,
    'Order Block (OB)': TargetIcon,
    'Inducement (IDM)': EyeIcon,
    'Optimal Trade Entry (OTE)': CheckCircleIcon,
    'Displacement': ZapIcon,
  };

  const getIconForConcept = (concept: string): React.FC<React.SVGProps<SVGSVGElement>> => {
      if (concept.includes('MSS')) return isBullish ? TrendingUpIcon : TrendingDownIcon;
      const iconKey = Object.keys(conceptToIconMap).find(key => concept.includes(key));
      return iconKey ? conceptToIconMap[iconKey] : ChevronRightIcon;
  };

  const relevantEvents = useMemo(() => {
    if (!economicEvents) return [];
    const currencies = pair.split('/');
    const now = new Date();
    
    return economicEvents
      .filter(event => currencies.includes(event.currency) && event.date > now)
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [economicEvents, pair]);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto border border-slate-700 animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-slate-900/70 backdrop-blur-sm z-10 p-5 border-b border-slate-800 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-slate-100">{signalText}: {pair}</h2>
            <span className={`text-sm font-semibold ${isBullish ? 'text-green-400/80' : 'text-red-400/80'}`}>
              Baseado no modelo de entrada Sniper em {setupTimeframe}
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => onSendToTelegram(opportunity)}
              className="flex items-center space-x-2 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 px-4 py-2 rounded-md text-sm font-semibold transition-colors duration-200"
              aria-label="Enviar Sinal para Telegram"
              title="Enviar Sinal para Telegram"
            >
              <SendIcon className="w-4 h-4" />
              <span>Enviar Sinal</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-slate-400 hover:bg-slate-700 hover:text-white"
            >
              <XIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-3 space-y-8">
                <div>
                    <h3 className="text-xl font-semibold text-slate-100 mb-4">Visualização da Negociação</h3>
                    <div className="bg-slate-900/50 rounded-lg border border-slate-700 overflow-hidden relative group h-80 md:h-[450px]">
                      <TradeChart opportunity={opportunity} />
                      <a
                        href={`https://www.tradingview.com/chart/?symbol=FX_IDC:${pair.replace('/', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Abrir em tela cheia"
                        className="absolute top-2 right-2 p-2 bg-slate-800/50 text-slate-400 rounded-full hover:bg-slate-700 hover:text-white transition-opacity duration-300 opacity-0 group-hover:opacity-100 focus:opacity-100"
                        aria-label="Abrir gráfico em tela cheia"
                      >
                        <ExternalLinkIcon className="w-5 h-5" />
                      </a>
                    </div>
                </div>
                 <div>
                    <h3 className="text-xl font-semibold text-slate-100 mb-4">Calculadora de Risco e Tamanho de Lote</h3>
                    <RiskCalculator
                      opportunity={opportunity}
                      accountBalance={accountBalance}
                      riskPercentage={riskPercentage}
                    />
                  </div>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-2 space-y-8">
                <div>
                    <h3 className="text-xl font-semibold text-slate-100 mb-4">Confluências do Sinal (Modelo Sniper)</h3>
                    <div className="space-y-3">
                      {setupAnalysis?.findings.map((finding, index) => {
                          const Icon = getIconForConcept(finding.concept);
                          return (
                            <div key={finding.id} className="bg-slate-800/60 p-4 rounded-lg border border-slate-700 flex items-start animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                               <div className="flex-shrink-0 w-10 h-10 bg-slate-900/50 rounded-lg flex items-center justify-center mr-4 border border-slate-700">
                                <Icon className="w-5 h-5 text-sky-400" />
                              </div>
                              <div>
                                <p className="font-bold text-md text-slate-100">Passo {index + 1}: {finding.concept}</p>
                                <p className="text-slate-300 text-sm mt-1">{finding.description}</p>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                    
                    <details className="mt-6 text-sm">
                        <summary className="cursor-pointer text-slate-400 hover:text-white list-none flex items-center">
                            <ChevronRightIcon className="w-4 h-4 mr-1 transition-transform duration-200 transform details-open:rotate-90" />
                            Análise de Contexto (Outros Timeframes)
                        </summary>
                        <div className="mt-4 pl-5 border-l-2 border-slate-700 space-y-4">
                            {sortedAnalysis.filter(item => item.timeframe !== setupTimeframe).map(item => (
                                <div key={item.timeframe}>
                                    <p className="font-bold text-md text-slate-200 mb-2">{item.timeframe}</p>
                                    <ul className="space-y-2">
                                      {item.findings.map(finding => (
                                        <li key={finding.id} className="flex items-start">
                                          <span className="text-slate-500 mr-2">–</span>
                                          <span className="text-slate-400">{finding.description}</span>
                                        </li>
                                      ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </details>
                </div>
                <div>
                    <h3 className="text-xl font-semibold text-slate-100 mb-4 flex items-center">
                      <CalendarIcon className="w-5 h-5 mr-3"/>
                      Próximos Eventos Econômicos
                    </h3>
                    {relevantEvents.length > 0 ? (
                      <div className="space-y-3 bg-slate-800/60 p-4 rounded-lg border border-slate-700">
                        {relevantEvents.slice(0, 5).map(event => ( // Show top 5
                          <div key={event.id} className="grid grid-cols-12 gap-x-4 items-center text-sm">
                            <div className="col-span-4 font-mono text-slate-400">
                              {event.date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}, {event.date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                            </div>
                            <div className="col-span-2 flex items-center font-bold text-slate-300">{event.currency}</div>
                            <div className="col-span-1 flex items-center"><ImpactDot impact={event.impact} /></div>
                            <div className="col-span-5 text-slate-300 truncate">{event.name}</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-slate-800/60 p-4 rounded-lg border border-slate-700 text-center">
                        <p className="text-sm text-slate-400">Nenhum evento econômico de impacto agendado para este par em breve.</p>
                      </div>
                    )}
                </div>
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
        details > summary {
            list-style: none;
        }
        details > summary::-webkit-details-marker {
            display: none;
        }
        details[open] > summary .details-open\\:rotate-90 {
            transform: rotate(90deg);
        }
      `}</style>
    </div>
  );
};