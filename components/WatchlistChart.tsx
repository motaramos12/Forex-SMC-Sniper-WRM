import React, { useEffect, useRef } from 'react';
import { getTradingViewSymbol } from '../constants';

declare global {
  interface Window {
    TradingView: any;
  }
}

interface WatchlistChartProps {
  pair: string;
}

export const WatchlistChart: React.FC<WatchlistChartProps> = ({ pair }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetId = `tradingview_watchlist_widget_${pair.replace(/[^a-zA-Z0-9]/g, '_')}`;

  useEffect(() => {
    if (!containerRef.current || typeof window.TradingView === 'undefined') {
      return;
    }

    // Limpa o contêiner para evitar múltiplos widgets em re-renderizações rápidas
    containerRef.current.innerHTML = '';

    new window.TradingView.widget({
      autosize: true,
      symbol: getTradingViewSymbol(pair),
      interval: 'D', // Tempo gráfico diário
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      theme: 'dark',
      style: '3', // Gráfico de linha simplificado
      locale: 'br',
      toolbar_bg: '#f1f3f6',
      hide_top_toolbar: true,
      hide_side_toolbar: true,
      enable_publishing: false,
      allow_symbol_change: false,
      withdateranges: false,
      details: false,
      hotlist: false,
      calendar: false,
      container_id: containerRef.current.id,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pair]); 

  return (
    <div className="relative w-full h-full">
      <div 
        ref={containerRef} 
        id={widgetId}
        className="w-full h-full"
      />
    </div>
  );
};