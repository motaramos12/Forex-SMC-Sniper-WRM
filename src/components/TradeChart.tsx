
import React, { useEffect, useRef } from 'react';
import type { TradeOpportunity, Timeframe } from '../types';
import { getTradingViewSymbol } from '../constants';

declare global {
  interface Window {
    TradingView: any;
  }
}

interface TradeChartProps {
  opportunity: TradeOpportunity;
}

const mapTimeframeToInterval = (timeframe: Timeframe): string => {
  switch (timeframe) {
    case 'M1': return '1';
    case 'M5': return '5';
    case 'M15': return '15';
    case 'H1': return '60';
    case 'H4': return '240';
    case 'D1': return 'D';
    default: return '15'; // Fallback sensato
  }
};

export const TradeChart: React.FC<TradeChartProps> = ({ opportunity }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { pair, id, setupTimeframe } = opportunity;

  useEffect(() => {
    // O script do TradingView é carregado no index.html.
    // A lógica de adicionar/remover o script aqui é redundante e foi removida.
    // Apenas criamos o widget quando o componente é montado/atualizado.
    
    // Pequena verificação para garantir que o script carregou antes de tentarmos usá-lo.
    if (!containerRef.current || typeof window.TradingView === 'undefined') {
      return;
    }
      
    // Limpa o contêiner para evitar múltiplos widgets
    containerRef.current.innerHTML = '';
    
    new window.TradingView.widget({
      autosize: true,
      symbol: getTradingViewSymbol(pair),
      interval: mapTimeframeToInterval(setupTimeframe), // Corrigido: Usa o tempo gráfico da configuração
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      theme: 'dark',
      style: '1',
      locale: 'br',
      toolbar_bg: '#f1f3f6',
      enable_publishing: false,
      hide_side_toolbar: false,
      allow_symbol_change: true,
      container_id: containerRef.current.id,
    });

  }, [pair, id, setupTimeframe]); // Corrigido: Adicionadas dependências para recriar o widget corretamente

  return (
    <div className="relative w-full h-full">
      <div 
        ref={containerRef} 
        id={`tradingview_widget_${id}`}
        className="w-full h-full"
      />
    </div>
  );
};
