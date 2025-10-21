
import type { TradeOpportunity, Bias, Timeframe, SMCFinding, MarketAnalysisData, PairMarketAnalysis } from '../types';
import { AVAILABLE_SYMBOLS, TIMEFRAMES_ORDER, getSymbolType } from '../constants';

const getRandomElement = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const generateRandomPrice = (base: number, volatility: number): number => {
    return base + (Math.random() - 0.5) * volatility;
};

/**
 * Genera uma análise SMC de alta precisão baseada nos modelos de entrada "sniper" do ICT.
 * Esta função cria uma narrativa lógica que imita a sequência de eventos de um trade de alta probabilidade.
 * @param bias O viés direcional (Bullish/Bearish).
 * @returns Um array de descobertas SMC.
 */
const generateSniperEntryModel = (bias: Bias): { findings: SMCFinding[], poiConcept: 'Fair Value Gap (FVG)' | 'Order Block (OB)' } => {
    const findings: { concept: string, description: string }[] = [];
    const isBullish = bias === 'Bullish';

    // 1. Contexto de Tempo Gráfico Superior
    findings.push({ 
        concept: 'Higher Timeframe POI', 
        description: `O setup se origina de um Ponto de Interesse (POI) de tempo gráfico superior ${isBullish ? 'de alta' : 'de baixa'}.` 
    });

    // 2. Captura de Liquidez
    findings.push({ 
        concept: 'Liquidity Grab', 
        description: `O preço varreu a liquidez ${isBullish ? 'abaixo de um fundo chave (SSL)' : 'acima de um topo chave (BSL)'}.` 
    });

    // 3. MSS com Deslocamento
    findings.push({ 
        concept: 'Market Structure Shift (MSS)', 
        description: `Um forte movimento de Deslocamento causou uma Mudança na Estrutura do Mercado (MSS), sinalizando uma reversão.` 
    });
    
    // 4. Criação de POI de Entrada (FVG ou OB)
    const poiConcept = Math.random() > 0.5 ? 'Fair Value Gap (FVG)' : 'Order Block (OB)';
    findings.push({ 
        concept: poiConcept, 
        description: `O deslocamento criou um ${poiConcept} de alta probabilidade, que servirá como nossa zona de entrada.` 
    });

    // 5. Inducement (opcional, para mais realismo)
    if (Math.random() > 0.4) {
        findings.push({ 
            concept: 'Inducement (IDM)', 
            description: `A liquidez interna (IDM) foi capturada antes que o preço atingisse o POI principal, aumentando a convicção.` 
        });
    }

    // 6. Razão de Entrada
    findings.push({ 
        concept: 'Optimal Trade Entry (OTE)', 
        description: `A entrada está planejada no reteste do POI, na zona de Entrada Ótima de Negociação (OTE) ${isBullish ? 'de desconto' : 'premium'}.` 
    });

    return {
        findings: findings.map((f, i) => ({
            id: `finding-sniper-${i}-${Date.now()}`,
            ...f
        })),
        poiConcept
    };
};


export const scanMarket = (maxToGenerate: number = 2): Promise<TradeOpportunity[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      if (Math.random() < 0.2) {
        resolve([]);
        return;
      }

      const opportunities: TradeOpportunity[] = [];
      const numOpportunities = Math.min(maxToGenerate, Math.floor(Math.random() * 2) + 1);
      const usedPairs = new Set<string>();

      for (let i = 0; i < numOpportunities; i++) {
        let pair: string;
        do {
            pair = getRandomElement(AVAILABLE_SYMBOLS);
        } while (usedPairs.has(pair));
        usedPairs.add(pair);
        
        const symbolType = getSymbolType(pair);
        let basePrice;

        switch (symbolType) {
            case 'metal': basePrice = 2300 + (Math.random() * 100); break;
            case 'index': basePrice = pair.includes('US30') ? 39000 + (Math.random() * 500) : 18000 + (Math.random() * 500); break;
            default: basePrice = 1.05 + (Math.random() * 0.2); break;
        }

        const bias: Bias = Math.random() > 0.5 ? 'Bullish' : 'Bearish';
        const setupTimeframe = getRandomElement(['M15', 'M5'] as Timeframe[]);

        const { findings: sniperFindings, poiConcept } = generateSniperEntryModel(bias);
        
        // Simula a mecânica do preço baseada no modelo
        const isBullish = bias === 'Bullish';
        const priceVolatility = basePrice * (symbolType === 'forex' ? 0.005 : 0.01);
        const sweepLowOrHigh = basePrice + (isBullish ? -priceVolatility : priceVolatility);
        const mssPrice = basePrice + (isBullish ? priceVolatility * 0.5 : -priceVolatility * 0.5);

        // A entrada é um recuo para o POI após o MSS
        const entryPrice = mssPrice + (isBullish ? -priceVolatility * 0.3 : priceVolatility * 0.3);

        // O SL está abaixo da varredura de liquidez
        const stopLossDistance = Math.abs(entryPrice - sweepLowOrHigh) * 1.1; // 10% de buffer
        const riskRewardRatio = 3 + Math.random() * 5; // R/R entre 3 e 8
        const takeProfitDistance = stopLossDistance * riskRewardRatio;
        
        let stopLoss, takeProfit;
        if (bias === 'Bullish') {
          stopLoss = entryPrice - stopLossDistance;
          takeProfit = entryPrice + takeProfitDistance;
        } else {
          stopLoss = entryPrice + stopLossDistance;
          takeProfit = entryPrice - takeProfitDistance;
        }
        
        const fullAnalysis = TIMEFRAMES_ORDER.map(tf => {
            if (tf === setupTimeframe) {
                return { timeframe: tf, findings: sniperFindings };
            }
            // Análise simplificada para outros timeframes
            const isHigherTF = TIMEFRAMES_ORDER.indexOf(tf) < TIMEFRAMES_ORDER.indexOf(setupTimeframe);
            return {
                timeframe: tf,
                findings: [{
                    id: `finding-${tf}-${Date.now()}`,
                    concept: isHigherTF ? 'Estrutura de Mercado' : 'Confirmação',
                    description: isHigherTF ? `A estrutura de ${tf} está alinhada com o viés ${bias}.` : `Monitorando ${tf} para refinamento da entrada.`
                }]
            };
        });

        const opportunity: TradeOpportunity = {
          id: `opp-${i}-${Date.now()}`,
          pair,
          bias,
          entryPrice,
          stopLoss,
          takeProfit,
          analysis: fullAnalysis,
          setupTimeframe,
        };
        opportunities.push(opportunity);
      }
      resolve(opportunities);
    }, 750); // Reduzido de 2000ms para 750ms para maior responsividade
  });
};

export const getMarketAnalysis = (): Promise<MarketAnalysisData> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const analysisData: MarketAnalysisData = {};
            AVAILABLE_SYMBOLS.forEach(pair => {
                const bias: Bias = Math.random() > 0.5 ? 'Bullish' : 'Bearish';
                
                const analysis: PairMarketAnalysis = {
                    bias,
                    analysis: TIMEFRAMES_ORDER.filter(tf => ['D1', 'H4', 'H1', 'M15'].includes(tf)).map(tf => ({
                        timeframe: tf,
                        findings: [{
                            id: `mkt-finding-${tf}-${Date.now()}`,
                            concept: 'Estrutura de Mercado',
                            description: `Viés de ${tf} é ${bias}. Tendência confirmada com BoS recente.`
                        }],
                    })),
                };
                analysisData[pair] = analysis;
            });
            resolve(analysisData);
        }, 500); // Reduzido de 1500ms
    });
};
