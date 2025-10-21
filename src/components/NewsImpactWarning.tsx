
import React, { useState, useEffect, useMemo } from 'react';
import type { EconomicEvent } from '../types';
import { MegaphoneIcon, CheckCircleIcon, XIcon } from './icons';

interface NewsImpactWarningProps {
    events: EconomicEvent[];
}

// Helper to format remaining time
const formatTimeRemaining = (ms: number): string => {
    if (ms <= 0) return "00:00:00";
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const getCurrencyFlag = (currency: string) => `https://flagcdn.com/w20/${currency.slice(0, 2).toLowerCase()}.png`;

export const NewsImpactWarning: React.FC<NewsImpactWarningProps> = ({ events }) => {
    const [isVisible, setIsVisible] = useState(true);
    const [timeRemaining, setTimeRemaining] = useState<number>(0);

    const nextHighImpactEvent = useMemo(() => {
        const now = new Date();
        const next12Hours = new Date(now.getTime() + 12 * 60 * 60 * 1000);

        return events
            .filter(event => 
                event.impact === 'High' && 
                event.date > now &&
                event.date <= next12Hours
            )
            .sort((a, b) => a.date.getTime() - b.date.getTime())[0] || null;
    }, [events]);

    useEffect(() => {
        if (!nextHighImpactEvent) {
            setTimeRemaining(0);
            return;
        }

        const updateTimer = () => {
            const remaining = nextHighImpactEvent.date.getTime() - new Date().getTime();
            setTimeRemaining(remaining > 0 ? remaining : 0);
        };

        updateTimer();
        const intervalId = setInterval(updateTimer, 1000);

        return () => clearInterval(intervalId);
    }, [nextHighImpactEvent]);
    
    if (!isVisible) {
        return null;
    }

    const tradeWindowStart = nextHighImpactEvent ? new Date(nextHighImpactEvent.date.getTime() - 30 * 60 * 1000) : null;
    const tradeWindowEnd = nextHighImpactEvent ? new Date(nextHighImpactEvent.date.getTime() + 30 * 60 * 1000) : null;


    return (
        <div className={`relative bg-slate-800/40 backdrop-blur-sm border ${nextHighImpactEvent ? 'border-amber-500/50' : 'border-green-500/30'} rounded-xl p-4 mb-8 animate-fade-in`}>
             <button
                onClick={() => setIsVisible(false)}
                className="absolute top-2 right-2 p-1.5 rounded-full text-slate-400 hover:bg-slate-700 hover:text-white"
                title="Dispensar alerta"
            >
                <XIcon className="w-4 h-4" />
            </button>
            {nextHighImpactEvent ? (
                <div className="flex flex-col md:flex-row items-center gap-4">
                    <div className="flex-shrink-0">
                        <MegaphoneIcon className="w-10 h-10 text-amber-400" />
                    </div>
                    <div className="flex-grow text-center md:text-left">
                        <h3 className="font-bold text-lg text-slate-100">Atenção: Notícia de Alto Impacto Próxima</h3>
                        <div className="flex items-center justify-center md:justify-start gap-3 mt-1">
                             <img src={getCurrencyFlag(nextHighImpactEvent.currency)} alt={nextHighImpactEvent.currency} className="w-5 h-5 rounded-full" />
                             <p className="text-slate-300">{nextHighImpactEvent.name}</p>
                        </div>
                    </div>
                     <div className="text-center">
                        <p className="text-xs text-slate-400 uppercase tracking-wider">Tempo Restante</p>
                        <p className="text-2xl font-mono font-bold text-amber-300">{formatTimeRemaining(timeRemaining)}</p>
                    </div>
                    <div className="h-10 border-l border-slate-700 hidden md:block mx-4"></div>
                     <div className="text-center bg-slate-900/50 p-3 rounded-lg">
                        <p className="text-xs text-slate-400 uppercase tracking-wider">Janela de Risco</p>
                        <p className="text-base font-semibold text-slate-100">
                           {tradeWindowStart?.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} - {tradeWindowEnd?.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                         <p className="text-xs text-red-400/80 mt-1">Recomendado: Evitar operar</p>
                    </div>
                </div>
            ) : (
                <div className="flex items-center justify-center gap-4 text-center">
                    <CheckCircleIcon className="w-8 h-8 text-green-400" />
                    <div>
                        <h3 className="font-semibold text-lg text-slate-100">Mercado Limpo</h3>
                        <p className="text-slate-400 text-sm">Nenhuma notícia de alto impacto agendada para as próximas 12 horas.</p>
                    </div>
                </div>
            )}
        </div>
    );
};
