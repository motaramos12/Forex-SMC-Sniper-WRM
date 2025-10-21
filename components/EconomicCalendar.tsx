import React, { useState, useMemo } from 'react';
import type { EconomicEvent, ImpactLevel } from '../types';
import { XIcon, CalendarIcon, ExternalLinkIcon, ChevronRightIcon } from './icons';
import { EconomicEventDetailModal } from './EconomicEventDetailModal';

interface EconomicCalendarProps {
    events: EconomicEvent[];
    onClose: () => void;
    onGenerateAnalysis: (eventId: string) => Promise<void>;
}

const ImpactDot: React.FC<{ impact: ImpactLevel }> = ({ impact }) => {
    const color = {
        High: 'bg-red-500',
        Medium: 'bg-orange-400',
        Low: 'bg-yellow-400',
    }[impact];
    return <span className={`w-3 h-3 rounded-full ${color} flex-shrink-0`} title={`Impacto: ${impact}`}></span>;
};

const getCurrencyFlag = (currency: string) => `https://flagcdn.com/w20/${currency.slice(0, 2).toLowerCase()}.png`;

export const EconomicCalendar: React.FC<EconomicCalendarProps> = ({ events, onClose, onGenerateAnalysis }) => {
    const [impactFilters, setImpactFilters] = useState<Set<ImpactLevel>>(new Set(['High', 'Medium']));
    const [selectedEvent, setSelectedEvent] = useState<EconomicEvent | null>(null);
    const [isAnalysisLoading, setIsAnalysisLoading] = useState(false);
    
    const handleImpactFilterChange = (impact: ImpactLevel) => {
        setImpactFilters(prev => {
            const newSet = new Set(prev);
            if (newSet.has(impact)) {
                newSet.delete(impact);
            } else {
                newSet.add(impact);
            }
            return newSet;
        });
    };

    const handleViewAnalysis = async (event: EconomicEvent) => {
        setSelectedEvent(event);
        if (!event.aiAnalysis) {
            setIsAnalysisLoading(true);
            await onGenerateAnalysis(event.id);
             // The parent component will update the event prop, so we find it again
            const updatedEvent = events.find(e => e.id === event.id);
            if (updatedEvent) {
                setSelectedEvent(updatedEvent);
            }
            setIsAnalysisLoading(false);
        }
    };
    
    const filteredEvents = useMemo(() => {
        return events.filter(event => impactFilters.size === 0 || impactFilters.has(event.impact));
    }, [events, impactFilters]);

    const groupedEvents = useMemo(() => {
        return filteredEvents.reduce<Record<string, EconomicEvent[]>>((acc, event) => {
            const dateKey = event.date.toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
            if (!acc[dateKey]) {
                acc[dateKey] = [];
            }
            acc[dateKey].push(event);
            return acc;
        }, {} as Record<string, EconomicEvent[]>);
    }, [filteredEvents]);

    return (
        <>
        <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/80 rounded-xl p-4 md:p-6 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                    <CalendarIcon className="w-7 h-7 text-sky-400 mr-3" />
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-100">Calendário Econômico Inteligente</h2>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 rounded-full text-slate-400 hover:bg-slate-700 hover:text-white"
                    title="Fechar Calendário"
                >
                    <XIcon className="w-6 h-6" />
                </button>
            </div>

            <div className="mb-6 flex flex-wrap items-center gap-4 border-b border-slate-700 pb-4">
                <span className="text-sm font-medium text-slate-300">Filtro de Impacto:</span>
                {(['High', 'Medium', 'Low'] as ImpactLevel[]).map(impact => (
                    <label key={impact} className="flex items-center space-x-2 cursor-pointer text-slate-300">
                        <input
                            type="checkbox"
                            checked={impactFilters.has(impact)}
                            onChange={() => handleImpactFilterChange(impact)}
                            className="form-checkbox h-4 w-4 rounded bg-slate-700 border-slate-600 text-sky-500 focus:ring-sky-500"
                        />
                        <span>{impact}</span>
                    </label>
                ))}
            </div>

            <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
                 <div className="hidden md:grid md:grid-cols-12 md:gap-4 md:items-center sticky top-0 bg-slate-800/80 backdrop-blur-sm py-2 text-xs font-medium text-slate-300 uppercase tracking-wider z-10">
                    <div className="col-span-2">Hora</div>
                    <div className="col-span-1">Moeda</div>
                    <div className="col-span-1">Impacto</div>
                    <div className="col-span-2">Evento</div>
                    <div className="col-span-1 text-center">Atual</div>
                    <div className="col-span-1 text-center">Previsão</div>
                    <div className="col-span-1 text-center">Anterior</div>
                    <div className="col-span-1 text-center">Análise</div>
                    <div className="col-span-2 text-center">Fontes</div>
                </div>
                {Object.keys(groupedEvents).length > 0 ? (
                    Object.keys(groupedEvents).map(date => (
                        <div key={date}>
                            <h3 className="text-lg font-semibold text-sky-400 mb-3 sticky top-12 bg-slate-800/80 backdrop-blur-sm py-2">{date}</h3>
                            <div className="space-y-3">
                                {groupedEvents[date].map(event => (
                                    <div key={event.id} className="bg-slate-900/50 p-3 rounded-lg border border-slate-700 transition-all hover:border-sky-500/50">
                                        {/* Mobile View */}
                                        <div className="flex flex-col md:hidden">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <div className="flex items-center gap-3">
                                                        <img src={getCurrencyFlag(event.currency)} alt={event.currency} className="w-6 h-6 rounded-full" />
                                                        <span className="font-bold text-slate-100">{event.currency}</span>
                                                        <ImpactDot impact={event.impact} />
                                                    </div>
                                                    <p className="text-slate-200 text-sm mt-2">{event.name}</p>
                                                </div>
                                                <div className="text-right flex-shrink-0 ml-2">
                                                    <p className="font-mono text-slate-100">{event.date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
                                                    {(event.impact === 'High' || event.impact === 'Medium') && (
                                                        <button onClick={() => handleViewAnalysis(event)} className="mt-2 text-xs bg-sky-500/10 text-sky-300 hover:bg-sky-500/20 px-2 py-1 rounded-md font-semibold transition-colors">
                                                        Análise IA
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                            <details className="mt-3 text-sm">
                                                <summary className="cursor-pointer text-slate-400 list-none flex items-center">
                                                    <ChevronRightIcon className="w-4 h-4 mr-1 transition-transform duration-200 transform details-open:rotate-90" />
                                                    Ver Detalhes e Fontes
                                                </summary>
                                                <div className="mt-3 pt-3 border-t border-slate-700 space-y-2 text-slate-300">
                                                    <div className="flex justify-between"><span>Atual:</span><span className="font-mono">{event.actual || '–'}</span></div>
                                                    <div className="flex justify-between"><span>Previsão:</span><span className="font-mono">{event.forecast || '–'}</span></div>
                                                    <div className="flex justify-between"><span>Anterior:</span><span className="font-mono">{event.previous || '–'}</span></div>
                                                    <div className="flex items-center space-x-4 mt-3">
                                                        <span className="text-slate-400">Fontes:</span>
                                                        <div className="flex items-center space-x-3">
                                                            {event.externalLinks?.map(link => (
                                                                <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer" title={`Ver no ${link.name}`} className="text-slate-400 hover:text-sky-400 transition-colors">
                                                                    <ExternalLinkIcon className="w-5 h-5" />
                                                                </a>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </details>
                                        </div>

                                        {/* Desktop View */}
                                        <div className="hidden md:grid md:grid-cols-12 md:gap-4 md:items-center">
                                            <div className="col-span-2 text-sm font-mono text-slate-100">{event.date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</div>
                                            <div className="col-span-1 flex items-center">
                                                <img src={getCurrencyFlag(event.currency)} alt={event.currency} className="w-5 h-5 rounded-full mr-2" />
                                                <span className="text-sm font-bold text-slate-300">{event.currency}</span>
                                            </div>
                                            <div className="col-span-1 flex items-center"><ImpactDot impact={event.impact} /></div>
                                            <div className="col-span-2 items-center text-sm text-slate-200 truncate">{event.name}</div>
                                            <div className="col-span-1 flex items-center justify-center text-xs font-mono text-slate-400">{event.actual || '–'}</div>
                                            <div className="col-span-1 flex items-center justify-center text-xs font-mono text-slate-400">{event.forecast || '–'}</div>
                                            <div className="col-span-1 flex items-center justify-center text-xs font-mono text-slate-400">{event.previous || '–'}</div>
                                            <div className="col-span-1 flex items-center justify-center">
                                                {(event.impact === 'High' || event.impact === 'Medium') && (
                                                    <button onClick={() => handleViewAnalysis(event)} className="text-xs bg-sky-500/10 text-sky-300 hover:bg-sky-500/20 px-2 py-1 rounded-md font-semibold transition-colors">
                                                    Análise IA
                                                    </button>
                                                )}
                                            </div>
                                            <div className="col-span-2 flex items-center justify-center space-x-3">
                                                {event.externalLinks?.map(link => (
                                                    <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer" title={`Ver no ${link.name}`} className="text-slate-400 hover:text-sky-400 transition-colors">
                                                        <ExternalLinkIcon className="w-4 h-4" />
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-10 text-slate-400">
                        Nenhum evento encontrado para os filtros selecionados.
                    </div>
                )}
            </div>
        </div>
        {selectedEvent && (
            <EconomicEventDetailModal 
                event={selectedEvent} 
                onClose={() => setSelectedEvent(null)}
                isLoading={isAnalysisLoading}
            />
        )}
        <style>{`
            details > summary { list-style: none; }
            details > summary::-webkit-details-marker { display: none; }
            details[open] > summary .details-open\\:rotate-90 { transform: rotate(90deg); }
        `}</style>
        </>
    );
};