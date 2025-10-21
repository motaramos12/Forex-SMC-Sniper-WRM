
import React from 'react';
import { FilterIcon } from './icons';

interface FilterControlsProps {
    filters: {
        pair: string;
        bias: string;
        concept: string;
    };
    onFilterChange: (filterType: string, value: string) => void;
    pairs: string[];
    concepts: string[];
}

export const FilterControls: React.FC<FilterControlsProps> = ({ filters, onFilterChange, pairs, concepts }) => {
    return (
        <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/80 rounded-xl p-4 mb-8">
            <div className="flex items-center mb-4">
                <FilterIcon className="w-5 h-5 text-sky-400 mr-3" />
                <h3 className="text-lg font-semibold text-slate-100">Filtros de Oportunidades</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Filter by Pair */}
                <div>
                    <label htmlFor="pairFilter" className="block text-sm font-medium text-slate-300 mb-1">Par de Moedas</label>
                    <select
                        id="pairFilter"
                        value={filters.pair}
                        onChange={(e) => onFilterChange('pair', e.target.value)}
                        className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-slate-100 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
                    >
                        <option value="All">Todos os Pares</option>
                        {pairs.map(pair => <option key={pair} value={pair}>{pair}</option>)}
                    </select>
                </div>

                {/* Filter by Bias */}
                <div>
                    <label htmlFor="biasFilter" className="block text-sm font-medium text-slate-300 mb-1">Viés</label>
                    <select
                        id="biasFilter"
                        value={filters.bias}
                        onChange={(e) => onFilterChange('bias', e.target.value)}
                        className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-slate-100 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
                    >
                        <option value="All">Todos os Vieses</option>
                        <option value="Bullish">Bullish</option>
                        <option value="Bearish">Bearish</option>
                    </select>
                </div>

                {/* Filter by SMC Concept */}
                <div>
                    <label htmlFor="conceptFilter" className="block text-sm font-medium text-slate-300 mb-1">Conceito SMC</label>
                    <select
                        id="conceptFilter"
                        value={filters.concept}
                        onChange={(e) => onFilterChange('concept', e.target.value)}
                        className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-slate-100 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
                    >
                        <option value="All">Todos os Conceitos</option>
                        {concepts.map(concept => <option key={concept} value={concept}>{concept}</option>)}
                    </select>
                </div>
            </div>
        </div>
    );
};
