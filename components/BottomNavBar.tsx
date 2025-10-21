import React from 'react';
import { LayoutGridIcon, StarIcon, BookOpenIcon, EyeIcon, LinkIcon } from './icons';
import type { AppView } from '../types';

interface BottomNavBarProps {
  activeView: AppView;
  onSelectView: (view: AppView) => void;
}

const navItems = [
  { view: 'opportunities', label: 'Sinais', icon: LayoutGridIcon },
  { view: 'watchlist', label: 'Watchlist', icon: EyeIcon },
  { view: 'correlation', label: 'Correlação', icon: LinkIcon },
  { view: 'favorites', label: 'Favoritos', icon: StarIcon },
  { view: 'journal', label: 'Diário', icon: BookOpenIcon },
] as const;

export const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeView, onSelectView }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-slate-900/70 backdrop-blur-lg border-t border-slate-800 flex md:hidden z-40">
      {navItems.map(({ view, label, icon: Icon }) => {
        const isActive = activeView === view;
        return (
          <button
            key={view}
            onClick={() => onSelectView(view)}
            className={`relative flex-1 flex flex-col items-center justify-center text-xs transition-colors duration-200 p-1 ${
              isActive ? 'text-sky-400' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Icon className="w-6 h-6 mb-1" />
            <span>{label}</span>
            {isActive && <div className="absolute bottom-1 w-5 h-1 bg-sky-400 rounded-full"></div>}
          </button>
        );
      })}
    </div>
  );
};
