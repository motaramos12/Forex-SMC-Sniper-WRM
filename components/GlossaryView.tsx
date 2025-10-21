import React, { useState, useEffect, useMemo } from 'react';
import { getGlossaryTerms } from '../services/glossaryService';
import type { GlossaryTerm } from '../types';
import { LibraryIcon, RefreshCwIcon, ChevronRightIcon } from './icons';

interface GlossaryViewProps {
    onImageClick: (image: { url: string; alt: string }) => void;
}

export const GlossaryView: React.FC<GlossaryViewProps> = ({ onImageClick }) => {
    const [terms, setTerms] = useState<GlossaryTerm[]>([]);
    const [selectedTerm, setSelectedTerm] = useState<GlossaryTerm | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

    useEffect(() => {
        const fetchTerms = async () => {
            setIsLoading(true);
            const data = await getGlossaryTerms();
            setTerms(data);
            if (data.length > 0) {
                setSelectedTerm(data[0]);
                // Auto-expand the category of the first term for a better initial view
                setExpandedCategories(new Set([data[0].category]));
            }
            setIsLoading(false);
        };
        fetchTerms();
    }, []);

    const groupedTerms = useMemo(() => {
        return terms.reduce<Record<string, GlossaryTerm[]>>((acc, term) => {
            if (!acc[term.category]) {
                acc[term.category] = [];
            }
            acc[term.category].push(term);
            return acc;
        }, {});
    }, [terms]);

    const categoryOrder = [
        'Modelos de Entrada',
        'Estrutura e Tendência',
        'Conceitos de Liquidez',
        'Zonas de Interesse',
        'Conceitos de Execução'
    ];
    
    const handleCategoryToggle = (category: string) => {
        setExpandedCategories(prev => {
            const newSet = new Set(prev);
            if (newSet.has(category)) {
                newSet.delete(category);
            } else {
                newSet.add(category);
            }
            return newSet;
        });
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-96">
                <RefreshCwIcon className="w-10 h-10 text-sky-500 animate-spin" />
                <p className="mt-4 text-slate-300">Carregando glossário...</p>
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            <div className="flex items-center mb-8 border-b border-slate-700 pb-4">
                <LibraryIcon className="w-8 h-8 text-sky-400 mr-4" />
                <div>
                    <h2 className="text-3xl font-bold text-slate-100">Glossário de Conceitos Smart Money</h2>
                    <p className="text-slate-400">Aprenda os termos fundamentais por trás da análise SMC.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {/* Term List with Categories */}
                <div className="md:col-span-1 lg:col-span-1 bg-slate-800/40 border border-slate-700/80 rounded-xl p-4 h-fit max-h-[70vh] overflow-y-auto">
                    <h3 className="text-lg font-semibold text-slate-100 mb-4 px-3">Conceitos</h3>
                    <div className="space-y-1">
                        {categoryOrder.map(category => {
                            if (!groupedTerms[category]) return null;
                            const isExpanded = expandedCategories.has(category);
                            return (
                                <div key={category}>
                                    <button
                                        onClick={() => handleCategoryToggle(category)}
                                        className="w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-semibold text-slate-300 hover:bg-slate-700/70 transition-colors"
                                    >
                                        <span>{category}</span>
                                        <ChevronRightIcon className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
                                    </button>
                                    {isExpanded && (
                                        <nav className="pl-3 mt-1 space-y-1 border-l-2 border-slate-700 ml-3">
                                            {groupedTerms[category].map(term => (
                                                <button
                                                    key={term.id}
                                                    onClick={() => setSelectedTerm(term)}
                                                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors duration-200 ${
                                                        selectedTerm?.id === term.id
                                                            ? 'bg-sky-500/10 text-sky-400 font-semibold'
                                                            : 'text-slate-300 hover:bg-slate-700/70'
                                                    }`}
                                                >
                                                    {term.term} {term.abbreviation && `(${term.abbreviation})`}
                                                </button>
                                            ))}
                                        </nav>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Term Details */}
                <div className="md:col-span-2 lg:col-span-3">
                    {selectedTerm ? (
                        <div className="bg-slate-800/40 border border-slate-700/80 rounded-xl p-6">
                            <div className="mb-6">
                                <h3 className="text-2xl font-bold text-slate-100">{selectedTerm.term}</h3>
                                {selectedTerm.abbreviation && <p className="text-sky-400 font-mono">Abreviação: {selectedTerm.abbreviation}</p>}
                            </div>
                            
                            <div className="space-y-6">
                                <div>
                                    <h4 className="font-semibold text-md text-slate-300 mb-2 uppercase tracking-wider">Definição</h4>
                                    <p className="text-slate-300 leading-relaxed whitespace-pre-line">{selectedTerm.definition}</p>
                                </div>
                                
                                <div className="border-t border-slate-700 pt-6">
                                    <h4 className="font-semibold text-md text-slate-300 mb-2 uppercase tracking-wider">Exemplo Prático</h4>
                                    <p className="text-slate-300 leading-relaxed mb-4 whitespace-pre-line">{selectedTerm.example.description}</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full text-slate-500">
                            <p>Selecione um termo para ver os detalhes.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};