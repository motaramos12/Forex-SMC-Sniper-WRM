

import type { TradeOpportunity, Bias, SMCFinding } from '../types';
import { PIP_VALUE_MULTIPLIER, getSymbolType, formatPrice } from '../constants';

const TELEGRAM_BOT_TOKEN = '8246846217:AAHmXkAZ_MCcetaOvz_inD3hOnn0NACBRUY';
const TELEGRAM_CHAT_ID = '1619570720';

export const sendTelegramMessage = async (opportunity: TradeOpportunity, accountBalance: number, riskPercentage: number): Promise<boolean> => {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.error('Telegram Bot Token or Chat ID is not configured.');
    return false;
  }
  
  const { pair, bias, entryPrice, stopLoss, takeProfit, analysis, setupTimeframe } = opportunity;

  // Using MarkdownV2, which requires escaping certain characters.
  const escapeMarkdown = (text: string | number) => {
    const str = String(text);
    return str.replace(/[_*[\]()~`>#+-=|{}.!]/g, '\\$&');
  };
  
  const symbolType = getSymbolType(pair);
  const direcao = bias === 'Bullish' ? 'COMPRA' : 'VENDA';
  const direcaoIcon = bias === 'Bullish' ? '📈' : '📉';

  const timeframe = setupTimeframe || 'M15';
  const formattedTimeframe = timeframe.replace('M', '') + 'm';

  const multiplier = PIP_VALUE_MULTIPLIER[pair] || PIP_VALUE_MULTIPLIER['default'];
  const pipsToSl = Math.abs(entryPrice - stopLoss) * multiplier;
  const pipsToTp = Math.abs(takeProfit - entryPrice) * multiplier;
  const rr = pipsToSl > 0 ? (pipsToTp / pipsToSl) : 0;

  // Position Sizing
  const riskAmount = accountBalance * (riskPercentage / 100);
  const pipsAtRisk = Math.abs(entryPrice - stopLoss) * multiplier;
  // A standard assumption that 1 pip/point value is $10 for a standard lot on USD quoted pairs
  const pipValuePerStandardLot = 10;
  const lotSize = pipsAtRisk > 0 ? (riskAmount / pipsAtRisk) / pipValuePerStandardLot : 0;
  const potentialProfit = riskAmount * rr;

  // Confluences & Confidence
  const setupAnalysis = analysis.find(a => a.timeframe === setupTimeframe);
  const confluencesCount = setupAnalysis?.findings.length || 0;
  const confidence = Math.floor(Math.min(65 + confluencesCount * 7, 98));
  
  // Detailed Confluence Breakdown
  const getEmojiForConcept = (concept: string, bias: Bias): string => {
      if (concept.includes('MSS')) return bias === 'Bullish' ? '📈' : '📉';
      if (concept.includes('Liquidity')) return '💧';
      if (concept.includes('POI')) return '📚';
      if (concept.includes('FVG') || concept.includes('OB')) return '🎯';
      if (concept.includes('IDM')) return '👀';
      if (concept.includes('OTE')) return '✅';
      if (concept.includes('Displacement')) return '💥';
      return '🔹'; // Default bullet
  };

  let confluencesDetails = '';
  if (setupAnalysis && setupAnalysis.findings.length > 0) {
      confluencesDetails += `*🔎 Confluências do Sinal \\(Modelo Sniper\\):*\n\n`;
      setupAnalysis.findings.forEach((finding, index) => {
          const emoji = getEmojiForConcept(finding.concept, bias);
          confluencesDetails += `${emoji} *Passo ${index + 1}: ${escapeMarkdown(finding.concept)}*\n`;
          confluencesDetails += `_${escapeMarkdown(finding.description)}_\n\n`;
      });
  } else {
      // Fallback for older/simpler opportunities
      const uniqueConcepts = [...new Set(analysis.flatMap(a => a.findings).map(finding => finding.concept))];
      const setup = escapeMarkdown(uniqueConcepts.slice(0, 2).join(' + '));
      confluencesDetails = `📝 *Setup:* ${setup}\n`;
  }


  let message = `*🎯 SINAL SNIPER SMC DETECTADO*\n\n`;

  if (symbolType !== 'forex') {
    message += `⚡️ *Instrumento de Alta Volatilidade*\n\n`;
  }

  message += `📊 Par: *${escapeMarkdown(pair)}*\n`
  message += `${direcaoIcon} Direção: *${escapeMarkdown(direcao)}*\n`;
  message += `⏰ Timeframe: *${escapeMarkdown(formattedTimeframe)}*\n\n`;
  message += `*PONTOS DE PREÇO:*\n`;
  message += `Entrada: \`${escapeMarkdown(formatPrice(pair, entryPrice))}\`\n`;
  message += `Stop Loss: \`${escapeMarkdown(formatPrice(pair, stopLoss))}\`\n`;
  message += `Take Profit: \`${escapeMarkdown(formatPrice(pair, takeProfit))}\`\n`;
  message += `Risco/Retorno: *1:${escapeMarkdown(rr.toFixed(1))}*\n\n`;
  message += `*💼 GESTÃO DE RISCO:*\n`;
  message += `Volume Sugerido: \`${escapeMarkdown(lotSize.toFixed(2))}\` lotes\n`;
  message += `Risco Financeiro: *$${escapeMarkdown(riskAmount.toFixed(2))}*\n`;
  message += `Lucro Potencial: *$${escapeMarkdown(potentialProfit.toFixed(2))}*\n\n`;
  message += `*ANÁLISE DO SINAL:*\n`;
  message += `🔥 Confluências: *${escapeMarkdown(confluencesCount)}*\n`;
  message += `✨ Confiança: *${escapeMarkdown(confidence)}%*\n\n`;
  message += confluencesDetails; // Add the detailed breakdown


  const apiUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  // Use a CORS proxy to bypass browser restrictions
  const proxyUrl = `https://corsproxy.io/?${apiUrl}`;

  try {
    const response = await fetch(proxyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'MarkdownV2',
      }),
    });

    const responseText = await response.text();
    if (!response.ok) {
        console.error('Failed to send Telegram message. Status:', response.status, response.statusText);
        console.error('Response Body:', responseText);
        return false;
    }

    const data = JSON.parse(responseText);
    if (!data.ok) {
        console.error('Telegram API Error:', data.description);
        return false;
    }
    return true;
  } catch (error) {
    console.error('Failed to send Telegram message:', error);
    return false;
  }
};