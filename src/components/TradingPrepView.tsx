
import React, { useState, useEffect } from 'react';
import { ClipboardCheckIcon } from './icons';
import type { ChecklistItem } from '../types';

const INITIAL_CHECKLIST_ITEMS: Omit<ChecklistItem, 'completed'>[] = [
    { id: 'check-econ', text: 'Verifiquei o calendário econômico para notícias de alto impacto.' },
    { id: 'check-bias', text: 'Defini meu viés direcional para os pares principais.' },
    { id: 'check-emotion', text: 'Estou ciente do meu estado emocional (calmo, ansioso, etc.).' },
    { id: 'check-plan', text: 'Meu plano de negociação está claro e à vista.' },
    { id: 'check-risk', text: 'Revisei e confirmei meu gerenciamento de risco para o dia.' },
];

export const TradingPrepView: React.FC = () => {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

    const [checklist, setChecklist] = useState<ChecklistItem[]>(() => {
        const saved = localStorage.getItem('tradingPrepChecklist');
        if (saved) {
            const { date, items } = JSON.parse(saved);
            if (date === today) {
                return items;
            }
        }
        return INITIAL_CHECKLIST_ITEMS.map(item => ({ ...item, completed: false }));
    });

    const [journalText, setJournalText] = useState<string>(() => {
        const saved = localStorage.getItem('tradingPrepJournal');
        if (saved) {
            const { date, text } = JSON.parse(saved);
            if (date === today) {
                return text;
            }
        }
        return '';
    });
    
    useEffect(() => {
        localStorage.setItem('tradingPrepChecklist', JSON.stringify({ date: today, items: checklist }));
    }, [checklist, today]);
    
    useEffect(() => {
        localStorage.setItem('tradingPrepJournal', JSON.stringify({ date: today, text: journalText }));
    }, [journalText, today]);

    const handleChecklistToggle = (id: string) => {
        setChecklist(prev => prev.map(item =>
            item.id === id ? { ...item, completed: !item.completed } : item
        ));
    };

    const completionPercentage = (checklist.filter(item => item.completed).length / checklist.length) * 100;

    return (
        <div className="animate-fade-in">
            <div className="flex items-center mb-8 border-b border-slate-700 pb-4">
                <ClipboardCheckIcon className="w-8 h-8 text-sky-400 mr-4" />
                <div>
                    <h2 className="text-3xl font-bold text-slate-100">Preparo de Trading Diário</h2>
                    <p className="text-slate-400">Comece seu dia de negociação com foco e clareza.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Checklist Section */}
                <div className="bg-slate-800/40 border border-slate-700/80 rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-slate-100 mb-4">Checklist Diário</h3>
                    <div className="mb-4">
                        <div className="w-full bg-slate-700 rounded-full h-2.5">
                            <div
                                className="bg-sky-500 h-2.5 rounded-full transition-all duration-500"
                                style={{ width: `${completionPercentage}%` }}
                            ></div>
                        </div>
                         <p className="text-right text-sm text-slate-400 mt-1">{Math.round(completionPercentage)}% completo</p>
                    </div>
                    <div className="space-y-4">
                        {checklist.map(item => (
                            <label key={item.id} className="flex items-center space-x-3 cursor-pointer p-3 rounded-md hover:bg-slate-700/50 transition-colors">
                                <input
                                    type="checkbox"
                                    checked={item.completed}
                                    onChange={() => handleChecklistToggle(item.id)}
                                    className="h-5 w-5 rounded-sm bg-slate-700 border-slate-600 text-sky-500 focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-sky-500/50"
                                />
                                <span className={`text-slate-300 ${item.completed ? 'line-through text-slate-500' : ''}`}>
                                    {item.text}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Journal Section */}
                <div className="bg-slate-800/40 border border-slate-700/80 rounded-xl p-6">
                     <h3 className="text-xl font-semibold text-slate-100 mb-4">Diário de Preparação</h3>
                     <p className="text-sm text-slate-400 mb-4">
                        Anote seus pensamentos, análises de mercado, ou qualquer coisa para clarear sua mente antes de operar.
                     </p>
                     <textarea
                        value={journalText}
                        onChange={(e) => setJournalText(e.target.value)}
                        placeholder="Quais são suas expectativas para hoje? Quais pares você está observando?"
                        className="w-full h-56 bg-slate-900/70 border border-slate-600 rounded-md p-3 text-slate-100 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 resize-none transition"
                     />
                </div>
            </div>
             <style>{`
                input[type="checkbox"] {
                    -webkit-appearance: none;
                    appearance: none;
                    margin: 0;
                    font: inherit;
                    color: currentColor;
                    width: 1.25rem;
                    height: 1.25rem;
                    border: 1px solid #4B5563; /* border-slate-600 */
                    border-radius: 0.25rem;
                    transform: translateY(-0.075em);
                    display: grid;
                    place-content: center;
                }
                input[type="checkbox"]::before {
                    content: "";
                    width: 0.75rem;
                    height: 0.75rem;
                    transform: scale(0);
                    transition: 120ms transform ease-in-out;
                    box-shadow: inset 1em 1em #0ea5e9; /* text-sky-500 */
                    transform-origin: bottom left;
                    clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
                }
                input[type="checkbox"]:checked::before {
                    transform: scale(1);
                }
            `}</style>
        </div>
    );
};
