import type { Timeframe, MarketSession } from './types';

export const AVAILABLE_SYMBOLS: string[] = [
  'EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD', 'USD/CAD', 'USD/CHF', 'NZD/USD',
  'XAU/USD', 'US30/USD', 'US100/USD'
];

export const TIMEFRAMES_ORDER: Timeframe[] = ['D1', 'H4', 'H1', 'M15', 'M5', 'M1'];

export const SMC_CONCEPTS: string[] = [
  'Higher Timeframe POI',
  'Break of Structure (BoS)',
  'Market Structure Shift (MSS)',
  'Change of Character (ChoCH)',
  'Order Block (OB)',
  'Fair Value Gap (FVG)',
  'Liquidity Grab',
  'Inducement (IDM)',
  'Optimal Trade Entry (OTE)',
  'Displacement',
  'Mitigation',
];

export const PIP_VALUE_MULTIPLIER: { [key: string]: number } = {
  'USD/JPY': 100,
  'XAU/USD': 10,  // For moves of 0.1
  'US30/USD': 1, // For points
  'US100/USD': 1, // For points
  'default': 10000 // For 4-decimal forex pairs
};

export const SYMBOL_PRICE_DECIMALS: { [key: string]: number } = {
  'USD/JPY': 3,
  'XAU/USD': 2,
  'US30/USD': 2,
  'US100/USD': 2,
  'default': 5
};

export const SYMBOL_RISK_LABEL: { [key: string]: string } = {
  'US30/USD': 'Pontos',
  'US100/USD': 'Pontos',
  'default': 'Pips'
};

export const MARKET_SESSIONS: MarketSession[] = [
  { name: 'Sydney', currencies: ['AUD', 'NZD'], openUTC: 22, closeUTC: 7 },
  { name: 'Tokyo', currencies: ['JPY'], openUTC: 0, closeUTC: 9 },
  { name: 'London', currencies: ['GBP', 'EUR'], openUTC: 8, closeUTC: 17 },
  { name: 'New York', currencies: ['USD', 'CAD'], openUTC: 13, closeUTC: 22 },
];

// --- AVISO DE SEGURANÇA ---
// As chaves de API (tokens) NUNCA devem ser expostas diretamente no código do frontend.
// A forma correta é usar variáveis de ambiente, que são configuradas no serviço de hospedagem (Netlify, Vercel, etc.).
// O código abaixo está preparado para ler essas variáveis. Você precisará configurá-las no seu provedor de hospedagem.
export const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
export const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;


// --- Utility Functions ---

export const getSymbolType = (symbol: string): 'forex' | 'metal' | 'index' => {
    if (symbol.includes('XAU')) return 'metal';
    if (symbol.includes('US30') || symbol.includes('US100')) return 'index';
    return 'forex';
};

export const formatPrice = (symbol: string, price: number): string => {
    const decimals = SYMBOL_PRICE_DECIMALS[symbol] || SYMBOL_PRICE_DECIMALS['default'];
    return price.toFixed(decimals);
};

export const getRiskLabel = (symbol: string): string => {
    return SYMBOL_RISK_LABEL[symbol] || SYMBOL_RISK_LABEL['default'];
};

export const getTradingViewSymbol = (symbol: string): string => {
    const type = getSymbolType(symbol);
    const sanitizedSymbol = symbol.replace('/', '');

    switch (type) {
        case 'index':
            if (sanitizedSymbol === 'US30USD') return `OANDA:US30USD`;
            if (sanitizedSymbol === 'US100USD') return `OANDA:NAS100USD`;
            return `OANDA:${sanitizedSymbol}`;
        case 'metal':
            return `OANDA:${sanitizedSymbol}`;
        case 'forex':
        default:
            return `FX_IDC:${sanitizedSymbol}`;
    }
};