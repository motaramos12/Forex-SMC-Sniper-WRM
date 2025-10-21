import type { HistoricalTrade, Bias } from '../types';
import { AVAILABLE_SYMBOLS } from '../constants';

const getRandomElement = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const generateRandomPrice = (base: number, volatility: number): number => {
    return base + (Math.random() - 0.5) * volatility;
};

const generateHistoricalTrades = (): HistoricalTrade[] => {
    const trades: HistoricalTrade[] = [];
    const numTrades = 50; // Generate 50 historical trades
    const now = new Date();

    for (let i = 0; i < numTrades; i++) {
        const pair = getRandomElement(AVAILABLE_SYMBOLS);
        const bias: Bias = Math.random() > 0.5 ? 'Bullish' : 'Bearish';
        const basePrice = 1.05 + (Math.random() * 0.2);
        
        const entryPrice = generateRandomPrice(basePrice, 0.005);
        
        const stopLossDistance = 0.001 + Math.random() * 0.002;
        const riskRewardRatio = 1.5 + Math.random() * 4; // R/R between 1.5 and 5.5
        // Fix: Define `takeProfitDistance` to calculate the exit price for winning trades.
        const takeProfitDistance = stopLossDistance * riskRewardRatio;
        
        const isWin = Math.random() > 0.4; // 60% win rate
        
        let exitPrice;
        if (bias === 'Bullish') {
            exitPrice = isWin ? entryPrice + takeProfitDistance : entryPrice - stopLossDistance;
        } else { // Bearish
            exitPrice = isWin ? entryPrice - takeProfitDistance : entryPrice + stopLossDistance;
        }

        const closeDate = new Date(now);
        closeDate.setDate(now.getDate() - Math.floor(Math.random() * 90)); // Trades from the last 90 days
        closeDate.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));

        const pipMultiplier = pair.includes('JPY') ? 100 : 10000;
        const pipsChanged = (exitPrice - entryPrice) * (bias === 'Bullish' ? 1 : -1) * pipMultiplier;

        // Assuming a risk of $100 per trade for profit calculation
        const profitOrLoss = isWin ? (pipsChanged / (stopLossDistance * pipMultiplier)) * 100 * riskRewardRatio : -100;
        
        trades.push({
            id: `hist-${i}-${Date.now()}`,
            pair,
            bias,
            entryPrice,
            exitPrice,
            closeDate,
            result: isWin ? 'Win' : 'Loss',
            profitOrLoss: profitOrLoss,
            notes: isWin ? 'Segui o plano perfeitamente. A entrada foi precisa no bloco de ordens.' : 'Entrada hesitante, movi o SL muito cedo. Preciso confiar mais na minha análise inicial.',
            setupQuality: Math.floor(Math.random() * 3) + 3, // 3 to 5 stars
            executionQuality: isWin ? Math.floor(Math.random() * 2) + 4 : Math.floor(Math.random() * 3) + 2, // 4-5 for win, 2-4 for loss
            confluenceCount: Math.floor(Math.random() * 5) + 3, // 3 to 7 confluences
        });
    }

    return trades.sort((a, b) => b.closeDate.getTime() - a.closeDate.getTime());
};

export const getHistoricalTrades = (): Promise<HistoricalTrade[]> => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(generateHistoricalTrades());
        }, 300); // Reduzido de 800ms
    });
};