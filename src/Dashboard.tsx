import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Header } from './components/Header';
import { OpportunityCard } from './components/OpportunityCard';
import { OpportunityDetailModal } from './components/OpportunityDetailModal';
import { LoadingSpinner } from './components/LoadingSpinner';
import { scanMarket, getMarketAnalysis } from './services/forexScannerService';
import { getEconomicEvents } from './services/economicCalendarService';
import { getHistoricalTrades } from './services/historyService';
import { sendTelegramMessage } from './services/telegramService';
import { AlertNotification } from './components/AlertNotification';
import { ActionAlert } from './components/ActionAlert';
import { FilterControls } from './components/FilterControls';
import { MarketAnalysis } from './components/MarketAnalysis';
import { EconomicCalendar } from './components/EconomicCalendar';
import { BottomNavBar } from './components/BottomNavBar';
import { MarketSessions } from './components/MarketSessions';
import { BacktestView } from './components/BacktestView';
import { TradingPrepView } from './components/TradingPrepView';
import { FavoritesView } from './components/FavoritesView';
import { JournalView } from './components/HistoryView';
import { WatchlistView } from './components/WatchlistView';
import { CorrelationMatrixView } from './components/CorrelationMatrixView';
import { GlossaryView } from './components/GlossaryView';
import { NewsImpactWarning } from './components/NewsImpactWarning';
import { ImageModal } from './components/ImageModal';
import { Footer } from './components/Footer';
import { AVAILABLE_SYMBOLS, SMC_CONCEPTS } from './constants';
import type { TradeOpportunity, MarketAnalysisData, EconomicEvent, HistoricalTrade, AppView, AIAnalysis } from './types';
import { GoogleGenAI, Type } from "@google/genai";

export const Dashboard: React.FC = () => {
  const [opportunities, setOpportunities] = useState<TradeOpportunity[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isPolling, setIsPolling] = useState<boolean>(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<TradeOpportunity | null>(null);
  const [accountBalance, setAccountBalance] = useState<number>(10000);
  const [riskPercentage, setRiskPercentage] = useState<number>(1);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [notificationMessage, setNotificationMessage] = useState<string>('');
  const [activeAlerts, setActiveAlerts] = useState<Set<string>>(new Set());
  const [actionAlertMessage, setActionAlertMessage] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<AppView>('opportunities');
  const [marketAnalysisData, setMarketAnalysisData] = useState<MarketAnalysisData | null>(null);
  const [economicEvents, setEconomicEvents] = useState<EconomicEvent[]>([]);
  const [historicalTrades, setHistoricalTrades] = useState<HistoricalTrade[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  const [watchlist, setWatchlist] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('watchlist');
    // Start with a few default pairs for a better first-time experience
    const defaultPairs = new Set(['EUR/USD', 'GBP/USD', 'USD/JPY', 'XAU/USD', 'US30/USD']);
    return saved ? new Set(JSON.parse(saved)) : defaultPairs;
  });
  const [watchlistAlerts, setWatchlistAlerts] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('watchlistAlerts');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  const isInitialLoad = useRef(true);
  const intervalRef = useRef<number | null>(null);
  const [filters, setFilters] = useState({
    pair: 'All',
    bias: 'All',
    concept: 'All',
  });
  const [isAutoPilotActive, setIsAutoPilotActive] = useState<boolean>(true);
  const autoPilotIntervalRef = useRef<number | null>(null);
  const [modalImage, setModalImage] = useState<{url: string; alt: string} | null>(null);
  
  const ai = useMemo(() => new GoogleGenAI({ apiKey: process.env.API_KEY as string }), []);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(Array.from(favorites)));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('watchlist', JSON.stringify(Array.from(watchlist)));
  }, [watchlist]);

  useEffect(() => {
    localStorage.setItem('watchlistAlerts', JSON.stringify(Array.from(watchlistAlerts)));
  }, [watchlistAlerts]);

  const playNotificationSound = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    if (!audioContext) return;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(880, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.15);
  };

  const generateEventAnalysis = async (eventId: string): Promise<void> => {
    const event = economicEvents.find(e => e.id === eventId);
    if (!event || event.aiAnalysis) return;

    const prompt = `
      Analyze the following economic event for a Forex trader using Smart Money Concepts.
      Event Name: ${event.name}
      Currency: ${event.currency}
      Forecast: ${event.forecast}
      Previous: ${event.previous}
      
      Provide a concise analysis in JSON format. The analysis should include:
      1.  "explanation": A brief description of what this indicator measures and its importance.
      2.  "bullishImpact": Describe the scenario for a "better than expected" result (e.g., higher than forecast) and why it would be bullish for the currency.
      3.  "bearishImpact": Describe the scenario for a "worse than expected" result (e.g., lower than forecast) and why it would be bearish for the currency.
      4.  "volatilityRating": Rate the expected market volatility as "High", "Very High", or "Extreme".
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              explanation: { type: Type.STRING },
              bullishImpact: { type: Type.STRING },
              bearishImpact: { type: Type.STRING },
              volatilityRating: { type: Type.STRING, enum: ['High', 'Very High', 'Extreme'] },
            },
            required: ['explanation', 'bullishImpact', 'bearishImpact', 'volatilityRating'],
          },
        },
      });

      let jsonStr = response.text.trim();
      const analysis: AIAnalysis = JSON.parse(jsonStr);

      setEconomicEvents(prevEvents => 
        prevEvents.map(e => e.id === eventId ? { ...e, aiAnalysis: analysis } : e)
      );

    } catch (error) {
        console.error("Error generating AI analysis:", error);
        // Fallback or error handling
    }
  };

  const performScan = useCallback(async () => {
    if (isInitialLoad.current) {
      setIsLoading(true);
    } else {
      setIsPolling(true);
    }

    try {
      const [results, analysisData, events, history] = await Promise.all([
          scanMarket(2), 
          getMarketAnalysis(),
          getEconomicEvents(),
          isInitialLoad.current ? getHistoricalTrades() : Promise.resolve(null),
        ]);
      
      const prevOpIds = new Set(opportunities.map(op => op.id));
      const newOps = results.filter(op => !prevOpIds.has(op.id));

      if (newOps.length > 0) {
        if (!isInitialLoad.current) {
            const alertedPairs = new Set<string>();
            newOps.forEach(op => {
                if (watchlistAlerts.has(op.pair)) {
                    alertedPairs.add(op.pair);
                }
            });

            if (alertedPairs.size > 0) {
                setNotificationMessage(`Nova(s) oportunidade(s) para ${Array.from(alertedPairs).join(', ')} na sua watchlist!`);
            } else {
                setNotificationMessage("Novas oportunidades do scanner encontradas!");
            }
            setShowNotification(true);
            playNotificationSound();
        }

        setOpportunities(prev => {
            const combined = [...newOps, ...prev];
            const unique = Array.from(new Map(combined.map(item => [item.id, item])).values());
            // Limit total displayed opportunities to prevent clutter
            return unique.slice(0, 50);
        });
      }
      
      setMarketAnalysisData(analysisData);
      setEconomicEvents(events);
      if (history) {
        setHistoricalTrades(history);
      }
      setLastUpdated(new Date());

    } catch (error) {
      console.error("Failed to scan market:", error);
    } finally {
      if (isInitialLoad.current) {
        setIsLoading(false);
        isInitialLoad.current = false;
      }
      setIsPolling(false);
    }
  }, [opportunities, watchlistAlerts]);

  useEffect(() => {
    performScan();
    intervalRef.current = window.setInterval(performScan, 45000);
    return () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
    };
  }, [performScan]);

  const handleToggleAutoPilot = () => {
    setIsAutoPilotActive(prev => {
        if (prev) {
            setActionAlertMessage("Piloto Automático desativado.");
        }
        return !prev;
    });
  };

  useEffect(() => {
    const runAutoPilotScan = async () => {
        setIsPolling(true); // Indicate activity
        try {
            const newOpportunities = await scanMarket(1);
            if (newOpportunities.length > 0) {
                const opportunity = newOpportunities[0];
                const success = await sendTelegramMessage(opportunity, accountBalance, riskPercentage);
                if (success) {
                    setActionAlertMessage(`Piloto Automático enviou sinal para ${opportunity.pair}.`);
                } else {
                    setActionAlertMessage(`Piloto Automático falhou ao enviar sinal para ${opportunity.pair}. Verifique a configuração do token.`);
                }
            }
        } catch (error) {
            console.error("Auto-pilot scan failed:", error);
            setActionAlertMessage("Ocorreu um erro durante a varredura do Piloto Automático.");
        } finally {
            setIsPolling(false);
        }
    };

    if (isAutoPilotActive) {
        setActionAlertMessage("Piloto Automático ativado. Verificando a cada 15 minutos.");
        // Interval is 15 minutes
        autoPilotIntervalRef.current = window.setInterval(runAutoPilotScan, 15 * 60 * 1000); 
    }

    return () => {
        if (autoPilotIntervalRef.current) {
            clearInterval(autoPilotIntervalRef.current);
        }
    };
}, [isAutoPilotActive, accountBalance, riskPercentage]);


  const handleSelectOpportunity = (opportunity: TradeOpportunity) => {
    setSelectedOpportunity(opportunity);
  };

  const handleCloseModal = () => {
    setSelectedOpportunity(null);
  };

  const handleToggleAlert = (opportunityId: string, pair: string) => {
    setActiveAlerts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(opportunityId)) {
        newSet.delete(opportunityId);
        setActionAlertMessage(`Alerta removido para ${pair}.`);
      } else {
        newSet.add(opportunityId);
        setActionAlertMessage(`Alerta definido para ${pair}.`);
      }
      return newSet;
    });
  };

  const handleToggleFavorite = (opportunityId: string) => {
    setFavorites(prev => {
        const newSet = new Set(prev);
        if (newSet.has(opportunityId)) {
            newSet.delete(opportunityId);
            setActionAlertMessage("Removido dos favoritos.");
        } else {
            newSet.add(opportunityId);
            setActionAlertMessage("Adicionado aos favoritos!");
        }
        return newSet;
    });
  };

  const handleSendToTelegram = async (opportunity: TradeOpportunity) => {
    const success = await sendTelegramMessage(opportunity, accountBalance, riskPercentage);
    if(success) {
      setActionAlertMessage(`Sinal para ${opportunity.pair} enviado para o Telegram com sucesso!`);
    } else {
      setActionAlertMessage(`Falha ao enviar sinal para ${opportunity.pair}. Verifique a configuração do token.`);
    }
  };

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters(prev => ({...prev, [filterType]: value}));
  };

  const handleUpdateTradeNotes = (tradeId: string, notes: string) => {
    setHistoricalTrades(prev => prev.map(trade => 
      trade.id === tradeId ? { ...trade, notes } : trade
    ));
    setActionAlertMessage("Anotações da negociação salvas!");
  };

  const addToWatchlist = (pair: string) => {
    setWatchlist(prev => {
        const newSet = new Set(prev);
        newSet.add(pair);
        return newSet;
    });
    setActionAlertMessage(`${pair} adicionado à watchlist.`);
  };

  const removeFromWatchlist = (pair: string) => {
    setWatchlist(prev => {
        const newSet = new Set(prev);
        newSet.delete(pair);
        return newSet;
    });
    // also remove any related alerts
    setWatchlistAlerts(prev => {
        const newSet = new Set(prev);
        if (newSet.has(pair)) {
            newSet.delete(pair);
        }
        return newSet;
    });
    setActionAlertMessage(`${pair} removido da watchlist.`);
  };

  const toggleWatchlistAlert = (pair: string) => {
    setWatchlistAlerts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(pair)) {
        newSet.delete(pair);
        setActionAlertMessage(`Alertas de watchlist para ${pair} desativados.`);
      } else {
        newSet.add(pair);
        setActionAlertMessage(`Alertas de watchlist para ${pair} ativados.`);
      }
      return newSet;
    });
  };

  const filteredOpportunities = useMemo(() => {
    return opportunities.filter(op => {
      const pairMatch = filters.pair === 'All' || op.pair === filters.pair;
      const biasMatch = filters.bias === 'All' || op.bias === filters.bias;
      const conceptMatch = filters.concept === 'All' || op.analysis.some(a => a.findings.some(f => f.concept === filters.concept));
      return pairMatch && biasMatch && conceptMatch;
    });
  }, [opportunities, filters]);

  const favoriteOpportunities = useMemo(() => {
    return opportunities.filter(op => favorites.has(op.id));
  }, [opportunities, favorites]);
  
  const renderActiveView = () => {
    switch (activeView) {
      case 'opportunities':
        return (
          <>
            <NewsImpactWarning events={economicEvents} />
            <FilterControls
              filters={filters}
              onFilterChange={handleFilterChange}
              pairs={AVAILABLE_SYMBOLS}
              concepts={SMC_CONCEPTS}
            />
            {filteredOpportunities.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredOpportunities.map((opp) => (
                  <OpportunityCard
                    key={opp.id}
                    opportunity={opp}
                    onSelect={handleSelectOpportunity}
                    onToggleAlert={handleToggleAlert}
                    onToggleFavorite={handleToggleFavorite}
                    onSendToTelegram={handleSendToTelegram}
                    isAlertActive={activeAlerts.has(opp.id)}
                    isFavorite={favorites.has(opp.id)}
                    economicEvents={economicEvents}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-slate-400">
                <p>Nenhuma oportunidade encontrada com os filtros atuais.</p>
              </div>
            )}
          </>
        );
      case 'analysis':
        return marketAnalysisData ? <MarketAnalysis analysisData={marketAnalysisData} onClose={() => setActiveView('opportunities')} /> : null;
      case 'calendar':
        return <EconomicCalendar events={economicEvents} onClose={() => setActiveView('opportunities')} onGenerateAnalysis={generateEventAnalysis} />;
      case 'backtest':
        return <BacktestView />;
      case 'tradingprep':
        return <TradingPrepView />;
      case 'journal':
        return <JournalView trades={historicalTrades} onUpdateTradeNotes={handleUpdateTradeNotes} />;
      case 'favorites':
        return <FavoritesView 
                  opportunities={favoriteOpportunities}
                  onSelect={handleSelectOpportunity}
                  onToggleAlert={handleToggleAlert}
                  onToggleFavorite={handleToggleFavorite}
                  onSendToTelegram={handleSendToTelegram}
                  activeAlerts={activeAlerts}
                  favorites={favorites}
                  economicEvents={economicEvents}
               />;
      case 'watchlist':
        return <WatchlistView 
                  watchlist={watchlist}
                  opportunities={opportunities}
                  marketAnalysisData={marketAnalysisData}
                  onAddToWatchlist={addToWatchlist}
                  onRemoveFromWatchlist={removeFromWatchlist}
                  watchlistAlerts={watchlistAlerts}
                  onToggleWatchlistAlert={toggleWatchlistAlert}
               />;
      case 'correlation':
        return <CorrelationMatrixView watchlist={watchlist} />;
      case 'glossary':
        return <GlossaryView onImageClick={setModalImage} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 flex flex-col">
      <Header 
        lastUpdated={lastUpdated} 
        isLoading={isLoading} 
        isPolling={isPolling} 
        onSelectView={setActiveView}
        activeView={activeView}
        isAutoPilotActive={isAutoPilotActive}
        onToggleAutoPilot={handleToggleAutoPilot}
      />
      
      <div className="bg-slate-800/60 py-2 border-b border-slate-700/80 sticky top-16 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <MarketSessions />
        </div>
      </div>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-16 md:mb-0 flex-grow">
        {isLoading && isInitialLoad.current ? (
          <div className="flex justify-center items-center h-[calc(100vh-10rem)]">
            <LoadingSpinner />
          </div>
        ) : (
          renderActiveView()
        )}
      </main>

      {selectedOpportunity && (
        <OpportunityDetailModal
          opportunity={selectedOpportunity}
          onClose={handleCloseModal}
          accountBalance={accountBalance}
          riskPercentage={riskPercentage}
          onSendToTelegram={handleSendToTelegram}
          economicEvents={economicEvents}
        />
      )}

      {modalImage && (
        <ImageModal
            imageUrl={modalImage.url}
            altText={modalImage.alt}
            onClose={() => setModalImage(null)}
        />
      )}
      
      <AlertNotification 
        show={showNotification} 
        message={notificationMessage} 
        onClose={() => setShowNotification(false)} 
      />
      <ActionAlert
        message={actionAlertMessage}
        onClose={() => setActionAlertMessage(null)}
      />

      <BottomNavBar 
        activeView={activeView}
        onSelectView={setActiveView}
      />

      <Footer />
    </div>
  );
};
