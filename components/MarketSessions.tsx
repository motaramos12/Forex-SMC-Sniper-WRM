import React, { useState, useEffect } from 'react';
import { MARKET_SESSIONS } from '../constants';
import { ClockIcon } from './icons';

const useTime = (refreshCycle = 60000) => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => setNow(new Date()), refreshCycle);
    return () => clearInterval(intervalId);
  }, [refreshCycle]);

  return now;
};

const formatLocalTime = (date: Date) => {
  return date.toLocaleTimeString(navigator.language, {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const MarketSessions: React.FC = () => {
  const now = useTime();
  const utcHour = now.getUTCHours();

  const isSessionOpen = (open: number, close: number) => {
    if (open > close) {
      return utcHour >= open || utcHour < close;
    }
    return utcHour >= open && utcHour < close;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-y-2 sm:space-x-4 w-full justify-center">
        <div className="flex items-center">
            <ClockIcon className="w-5 h-5 text-slate-400 mr-2" />
            <div className="text-sm font-semibold">
                <span className="text-slate-100">{formatLocalTime(now)}</span>
                <span className="text-slate-400 ml-1">Horário Local</span>
            </div>
        </div>
        <div className="h-6 border-l border-slate-700 hidden sm:block"></div>
        <div className="flex items-center flex-wrap justify-center gap-x-4 gap-y-2">
            {MARKET_SESSIONS.map(session => {
                const isOpen = isSessionOpen(session.openUTC, session.closeUTC);
                return (
                    <div key={session.name} className="flex items-center space-x-2">
                        <span className={`w-2.5 h-2.5 rounded-full transition-colors ${isOpen ? 'bg-green-400 animate-pulse' : 'bg-slate-600'}`}></span>
                        <div className="text-sm">
                            <span className={isOpen ? 'text-slate-100 font-semibold' : 'text-slate-400'}>{session.name}</span>
                        </div>
                    </div>
                );
            })}
        </div>
    </div>
  );
};