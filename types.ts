// Fix: Replaced file content with only exported type definitions to resolve circular dependencies and widespread type errors.
export type Bias = 'Bullish' | 'Bearish';

export type Timeframe = 'D1' | 'H4' | 'H1' | 'M15' | 'M5' | 'M1';

export type AppView =
  | 'opportunities'
  | 'analysis'
  | 'tradingprep'
  | 'favorites'
  | 'watchlist'
  | 'correlation'
  | 'backtest'
  | 'journal'
  | 'glossary'
  | 'calendar';

export type ImpactLevel = 'High' | 'Medium' | 'Low';

export interface SMCFinding {
  id: string;
  concept: string;
  description: string;
}

export interface TradeOpportunity {
  id: string;
  pair: string;
  bias: Bias;
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  analysis: {
    timeframe: Timeframe;
    findings: SMCFinding[];
  }[];
  setupTimeframe: Timeframe;
}

export interface PairMarketAnalysis {
    bias: Bias;
    analysis: {
        timeframe: Timeframe;
        findings: SMCFinding[];
    }[];
}

export interface MarketAnalysisData {
  [key: string]: PairMarketAnalysis;
}

export interface MarketSession {
  name: string;
  currencies: string[];
  openUTC: number;
  closeUTC: number;
}

export interface AIAnalysis {
    explanation: string;
    bullishImpact: string;
    bearishImpact: string;
    volatilityRating: 'High' | 'Very High' | 'Extreme';
}

export interface EconomicEvent {
    id: string;
    date: Date;
    currency: string;
    impact: ImpactLevel;
    name: string;
    forecast?: string;
    previous?: string;
    actual?: string;
    aiAnalysis?: AIAnalysis;
    externalLinks?: {
        name: string;
        url: string;
    }[];
}

export interface HistoricalTrade {
    id: string;
    pair: string;
    bias: Bias;
    entryPrice: number;
    exitPrice: number;
    closeDate: Date;
    result: 'Win' | 'Loss';
    profitOrLoss: number;
    notes?: string;
    setupQuality?: number;
    executionQuality?: number;
    confluenceCount?: number;
}

export interface ChecklistItem {
    id: string;
    text: string;
    completed: boolean;
}

export interface BacktestParams {
    pair: string;
    strategy: string;
    startDate: string;
    endDate: string;
    initialBalance: number;
    riskPercentage: number;
}

export interface ConfluencePerformance {
    count: number;
    totalTrades: number;
    winRate: number;
    totalPnl: number;
}

export interface BacktestResult {
    totalTrades: number;
    winningTrades: number;
    losingTrades: number;
    winRate: number;
    finalBalance: number;
    totalProfitLoss: number;
    profitFactor: number;
    trades: HistoricalTrade[];
    confluenceAnalysis: ConfluencePerformance[];
}

export interface CorrelationMatrixData {
    [key: string]: {
        [key: string]: number;
    };
}

export interface GlossaryTerm {
    id: string;
    term: string;
    abbreviation?: string;
    category: string;
    definition: string;
    example: {
        description: string;
        imageUrl?: string;
    };
}