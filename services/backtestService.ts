import type { BacktestParams, BacktestResult, HistoricalTrade, Bias, ConfluencePerformance } from '../types';

const generateMockTrades = (params: BacktestParams): HistoricalTrade[] => {
    const trades: HistoricalTrade[] = [];
    const { startDate, endDate, initialBalance, riskPercentage, pair } = params;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Simulate roughly one trade every 3 days
    const numTrades = Math.floor(diffDays / 3) + (Math.random() * 10 - 5);
    
    let currentBalance = initialBalance;

    for (let i = 0; i < numTrades; i++) {
        const bias: Bias = Math.random() > 0.5 ? 'Bullish' : 'Bearish';
        
        // --- Core Logic Upgrade: Confluence-based Win Rate ---
        const confluenceCount = Math.floor(Math.random() * 5) + 3; // Simulate 3 to 7 confluences
        const baseWinRate = 0.30; // A base win rate for a minimal setup
        const bonusPerConfluence = 0.07; // Each extra confluence adds 7% to the win probability
        const isWin = Math.random() < (baseWinRate + (confluenceCount * bonusPerConfluence));
        // This makes win rate scale from ~51% for 3 confluences up to ~79% for 7.

        const riskRewardRatio = 1.5 + Math.random() * 2; // R/R between 1.5 and 3.5

        const riskAmount = currentBalance * (riskPercentage / 100);
        const profitOrLoss = isWin ? riskAmount * riskRewardRatio : -riskAmount;

        currentBalance += profitOrLoss;

        const tradeDate = new Date(start);
        tradeDate.setDate(start.getDate() + (i * 3) + Math.floor(Math.random() * 2));

        trades.push({
            id: `backtest-${i}-${Date.now()}`,
            pair: pair,
            bias,
            entryPrice: 1.1 + Math.random() * 0.1, // Mock price
            exitPrice: 1.1 + Math.random() * 0.1, // Mock price
            closeDate: tradeDate,
            result: isWin ? 'Win' : 'Loss',
            profitOrLoss,
            confluenceCount,
        });
    }

    return trades;
};

export const runBacktest = (params: BacktestParams): Promise<BacktestResult> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const trades = generateMockTrades(params);
            const totalTrades = trades.length;
            const winningTrades = trades.filter(t => t.result === 'Win').length;
            const losingTrades = totalTrades - winningTrades;
            const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;
            const totalProfitLoss = trades.reduce((acc, t) => acc + t.profitOrLoss, 0);
            const finalBalance = params.initialBalance + totalProfitLoss;
            const totalGains = trades.filter(t=> t.result === 'Win').reduce((acc, t) => acc + t.profitOrLoss, 0);
            const totalLosses = Math.abs(trades.filter(t=> t.result === 'Loss').reduce((acc, t) => acc + t.profitOrLoss, 0));
            const profitFactor = totalLosses > 0 ? totalGains / totalLosses : 0;

            // --- Confluence Analysis Calculation ---
            const confluenceGroups: { [key: number]: HistoricalTrade[] } = {};
            trades.forEach(trade => {
                const count = trade.confluenceCount || 0;
                if (!confluenceGroups[count]) {
                    confluenceGroups[count] = [];
                }
                confluenceGroups[count].push(trade);
            });

            const confluenceAnalysis: ConfluencePerformance[] = Object.keys(confluenceGroups)
                .map(key => Number(key))
                .sort((a,b) => a - b)
                .map(count => {
                    const groupTrades = confluenceGroups[count];
                    const groupWins = groupTrades.filter(t => t.result === 'Win').length;
                    return {
                        count: count,
                        totalTrades: groupTrades.length,
                        winRate: (groupWins / groupTrades.length) * 100,
                        totalPnl: groupTrades.reduce((acc, t) => acc + t.profitOrLoss, 0)
                    };
                });


            const result: BacktestResult = {
                totalTrades,
                winningTrades,
                losingTrades,
                winRate,
                finalBalance,
                totalProfitLoss,
                profitFactor,
                trades,
                confluenceAnalysis,
            };

            resolve(result);
        }, 1000); // Reduzido de 1500ms+
    });
};