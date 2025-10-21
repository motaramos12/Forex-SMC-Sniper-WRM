import React from 'react';
import { TargetIcon, RefreshCwIcon, ChartBarIcon, SendIcon, CalendarIcon, LayoutGridIcon, HistoryIcon, ClipboardCheckIcon, StarIcon, BookOpenIcon, EyeIcon, LinkIcon, LibraryIcon, ClockIcon, BotIcon } from './icons';
import type { AppView } from '../types';

interface HeaderProps {
  lastUpdated: Date | null;
  isLoading: boolean;
  isPolling: boolean;
  onSelectView: (view: AppView) => void;
  activeView: AppView;
  isAutoPilotActive: boolean;
  onToggleAutoPilot: () => void;
}

const navItems = [
  { view: 'opportunities', label: 'Oportunidades', icon: LayoutGridIcon },
  { view: 'analysis', label: 'Análise de Mercado', icon: ChartBarIcon },
  { view: 'tradingprep', label: 'Preparo de Trading', icon: ClipboardCheckIcon },
  { view: 'favorites', label: 'Favoritos', icon: StarIcon },
  { view: 'watchlist', label: 'Watchlist', icon: EyeIcon },
  { view: 'correlation', label: 'Correlação', icon: LinkIcon },
  { view: 'backtest', label: 'Backtest', icon: HistoryIcon },
  { view: 'journal', label: 'Diário', icon: BookOpenIcon },
  { view: 'glossary', label: 'Glossário SMC', icon: LibraryIcon },
  { view: 'calendar', label: 'Calendário Econômico', icon: CalendarIcon },
] as const;


export const Header: React.FC<HeaderProps> = ({ lastUpdated, isLoading, isPolling, onSelectView, activeView, isAutoPilotActive, onToggleAutoPilot }) => {
  return (
    <header className="bg-slate-900/70 backdrop-blur-lg border-b border-slate-800 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <TargetIcon className="h-8 w-8 text-sky-500" />
            <h1 className="text-xl md:text-2xl font-bold text-slate-100 ml-3">
              <span className="text-gradient">Forex SMC Sniper</span>
            </h1>
          </div>

          <div className="flex items-center space-x-2 md:space-x-4">
            <div 
              title={isAutoPilotActive ? "Desativar Piloto Automático" : "Ativar Piloto Automático"} 
              className="flex items-center space-x-2 p-2 bg-slate-800/50 rounded-lg"
            >
                <BotIcon className={`h-5 w-5 transition-colors ${isAutoPilotActive ? 'text-sky-400' : 'text-slate-400'}`} />
                <span className={`text-sm font-medium hidden sm:block transition-colors ${isAutoPilotActive ? 'text-slate-100' : 'text-slate-400'}`}>
                    Piloto Automático
                </span>
                <button
                    onClick={onToggleAutoPilot}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${
                        isAutoPilotActive ? 'bg-sky-600' : 'bg-slate-700'
                    }`}
                >
                    <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            isAutoPilotActive ? 'translate-x-5' : 'translate-x-0'
                        }`}
                    />
                </button>
            </div>
             <div className="flex items-center space-x-2 p-2 bg-slate-800/50 rounded-lg">
                {isPolling && !isLoading ? (
                    <>
                        <RefreshCwIcon className="h-4 w-4 text-sky-400 animate-spin" />
                        <span className="text-sm font-medium text-sky-400 hidden sm:block">Verificando...</span>
                    </>
                ) : (
                    <>
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                        <span className="text-sm font-medium text-green-400 hidden sm:block">Ativo</span>
                    </>
                )}
             </div>
             {lastUpdated && (
                <span className="text-xs text-slate-400 hidden md:block">
                  {lastUpdated.toLocaleTimeString()}
                </span>
            )}
            <div className="hidden md:flex items-center space-x-1 bg-slate-800/50 p-1 rounded-lg">
              {navItems.map(({ view, label, icon: Icon }) => (
                <button
                    key={view}
                    onClick={() => onSelectView(view)}
                    disabled={isLoading}
                    className={`flex items-center justify-center h-9 w-9 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                        activeView === view
                        ? 'bg-sky-500/10 text-sky-400' 
                        : 'text-slate-400 hover:bg-slate-700/70 hover:text-sky-400'
                    }`}
                    aria-label={label}
                    title={label}
                >
                    <Icon className="h-5 w-5" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
