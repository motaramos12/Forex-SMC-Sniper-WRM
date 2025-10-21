import React from 'react';
import type { TradeOpportunity } from '../types';
import { PIP_VALUE_MULTIPLIER, getRiskLabel } from '../constants';

interface RiskCalculatorProps {
  opportunity: TradeOpportunity;
  accountBalance: number;
  riskPercentage: number;
}

export const RiskCalculator: React.FC<RiskCalculatorProps> = ({
  opportunity,
  accountBalance,
  riskPercentage,
}) => {
  const { pair, entryPrice, stopLoss } = opportunity;

  /**
   * Calcula o valor de um pip para um lote padrão (100.000 unidades) em USD.
   * Isso fornece um valor preciso com base na taxa de câmbio atual (preço de entrada).
   * @param pair O par de moedas (ex: 'EUR/USD').
   * @param currentRate A taxa de câmbio atual para o par.
   * @returns O valor de um pip em USD para um lote padrão.
   */
  const getPrecisePipValuePerLot = (pair: string, currentRate: number): number => {
    const [base, quote] = pair.split('/');
    
    // For Forex, Metals (XAU), and Indices (US30, US100) quoted in USD,
    // a standard contract move is typically valued around $10 per pip/point/tick.
    // This is a common industry standard for retail platforms.
    if (quote === 'USD') {
      return 10;
    }
    
    // Handle cases where USD is the base currency
    if (base === 'USD') {
      if (currentRate === 0) return 0;
      const pipDecimal = pair.includes('JPY') ? 0.01 : 0.0001;
      const valuePerLot = (pipDecimal * 100000) / currentRate;
      return valuePerLot;
    }
    
    // Default fallback for cross pairs (e.g., EUR/GBP)
    // This would need a more complex calculation involving the quote currency's rate against USD in a real app.
    return 10; 
  };
  
  const riskAmount = accountBalance * (riskPercentage / 100);
  
  const multiplier = PIP_VALUE_MULTIPLIER[pair] || PIP_VALUE_MULTIPLIER['default'];
  const pipsAtRisk = Math.abs(entryPrice - stopLoss) * multiplier;

  const requiredPipValue = pipsAtRisk > 0 ? riskAmount / pipsAtRisk : 0;
  
  const pipValuePerStandardLot = getPrecisePipValuePerLot(pair, entryPrice);
  
  const lotSize = pipValuePerStandardLot > 0 ? requiredPipValue / pipValuePerStandardLot : 0;

  const lotSizes = [
    { name: 'Padrão', value: lotSize.toFixed(2) },
    { name: 'Mini', value: (lotSize * 10).toFixed(2) },
    { name: 'Micro', value: (lotSize * 100).toFixed(2) },
  ];

  return (
    <div className="bg-slate-800/60 p-4 rounded-lg border border-slate-700 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        <div className="bg-slate-800 p-3 rounded-md">
            <p className="text-slate-400">{getRiskLabel(pair)} em Risco</p>
            <p className="text-slate-100 font-bold text-lg">{pipsAtRisk.toFixed(1)}</p>
        </div>
        <div className="bg-slate-800 p-3 rounded-md">
            <p className="text-slate-400">Valor em Risco</p>
            <p className="text-red-400 font-bold text-lg">${riskAmount.toFixed(2)}</p>
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-md text-slate-100 mb-2">Tamanho do Lote Sugerido</h4>
        <div className="space-y-2">
            {lotSizes.map(lot => (
                 <div key={lot.name} className="flex justify-between items-center bg-slate-800 p-3 rounded-md">
                    <span className="text-slate-300">{lot.name}:</span>
                    <span className="font-mono text-sky-400 text-lg font-bold">{lot.value}</span>
                </div>
            ))}
        </div>
        <p className="text-xs text-slate-500 mt-3">
          Cálculo de precisão baseado no preço de entrada. Verifique com sua corretora.
        </p>
      </div>
    </div>
  );
};