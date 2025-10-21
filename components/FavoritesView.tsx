import React from 'react';
import type { TradeOpportunity, EconomicEvent } from '../types';
import { OpportunityCard } from './OpportunityCard';
import { StarIcon } from './icons';

interface FavoritesViewProps {
    opportunities: TradeOpportunity[];
    onSelect: (opportunity: TradeOpportunity) => void;
    onToggleAlert: (opportunityId: string, pair: string) => void;
    onToggleFavorite: (opportunityId: string) => void;
    onSendToTelegram: (opportunity: TradeOpportunity) => void;
    activeAlerts: Set<string>;
    favorites: Set<string>;
    economicEvents: EconomicEvent[];
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({ opportunities, onSelect, onToggleAlert, onToggleFavorite, onSendToTelegram, activeAlerts, favorites, economicEvents }) => {
    return (
        <div className="animate-fade-in">
            <div className="flex items-center mb-8 border-b border-slate-700 pb-4">
                <StarIcon className="w-8 h-8 text-amber-400 mr-4" />
                <div>
                    <h2 className="text-3xl font-bold text-slate-100">Oportunidades Favoritas</h2>
                    <p className="text-slate-400">Suas oportunidades de negociação salvas para fácil acesso.</p>
                </div>
            </div>

            {opportunities.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {opportunities.map((opp) => (
                        <OpportunityCard
                            key={opp.id}
                            opportunity={opp}
                            onSelect={onSelect}
                            onToggleAlert={onToggleAlert}
                            onToggleFavorite={onToggleFavorite}
                            onSendToTelegram={onSendToTelegram}
                            isAlertActive={activeAlerts.has(opp.id)}
                            isFavorite={favorites.has(opp.id)}
                            economicEvents={economicEvents}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-[calc(100vh-20rem)] text-center p-4">
                    <StarIcon className="w-16 h-16 text-slate-600 mb-4" />
                    <h3 className="text-2xl font-bold text-slate-100 mb-2">Nenhum Favorito Ainda</h3>
                    <p className="text-slate-400 max-w-md">
                        Clique no ícone de estrela em qualquer oportunidade para adicioná-la aqui.
                    </p>
                </div>
            )}
        </div>
    );
};