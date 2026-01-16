import { useEffect, useRef } from 'react';
import useStore from './store';

// Calculate correlation coefficient between two price arrays
const calculateCorrelation = (arr1, arr2) => {
  if (arr1.length !== arr2.length || arr1.length === 0) return 0;
  
  const n = arr1.length;
  const sum1 = arr1.reduce((a, b) => a + b, 0);
  const sum2 = arr2.reduce((a, b) => a + b, 0);
  const sum1Sq = arr1.reduce((a, b) => a + b * b, 0);
  const sum2Sq = arr2.reduce((a, b) => a + b * b, 0);
  const pSum = arr1.reduce((a, b, i) => a + b * arr2[i], 0);
  
  const num = pSum - (sum1 * sum2 / n);
  const den = Math.sqrt((sum1Sq - sum1 * sum1 / n) * (sum2Sq - sum2 * sum2 / n));
  
  if (den === 0) return 0;
  return num / den;
};

export const useBinanceWebSocket = () => {
  const wsRef = useRef(null);
  const priceHistoryRef = useRef({});
  const { coins, updatePriceData, updateOrderBook, updateCorrelation, setWsConnected } = useStore();

  useEffect(() => {
    if (coins.length === 0) return;

    // Format tickers for Binance (add USDT)
    const streams = coins.map(coin => 
      `${coin.ticker.toLowerCase()}usdt@ticker/${coin.ticker.toLowerCase()}usdt@depth10@100ms`
    ).join('/');

    const wsUrl = `wss://stream.binance.com:9443/stream?streams=${streams}`;
    
    const connectWebSocket = () => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.close();
      }

      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connected');
        setWsConnected(true);
      };

      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        
        if (message.data) {
          const data = message.data;
          const symbol = data.s?.replace('USDT', '') || '';
          
          // Handle ticker data
          if (data.e === '24hrTicker') {
            const priceData = {
              price: parseFloat(data.c),
              high24h: parseFloat(data.h),
              low24h: parseFloat(data.l),
              volume24h: parseFloat(data.v),
              priceChange24h: parseFloat(data.p),
              priceChangePercent24h: parseFloat(data.P),
              quoteVolume: parseFloat(data.q),
            };
            
            updatePriceData(symbol, priceData);
            
            // Store price history for correlation calculation
            if (!priceHistoryRef.current[symbol]) {
              priceHistoryRef.current[symbol] = [];
            }
            priceHistoryRef.current[symbol].push(priceData.price);
            
            // Keep only last 100 prices
            if (priceHistoryRef.current[symbol].length > 100) {
              priceHistoryRef.current[symbol].shift();
            }
            
            // Calculate correlations if we have BTC and ETH data
            if (priceHistoryRef.current.BTC && priceHistoryRef.current.ETH && 
                priceHistoryRef.current[symbol] && symbol !== 'BTC' && symbol !== 'ETH') {
              const btcCorr = calculateCorrelation(
                priceHistoryRef.current[symbol],
                priceHistoryRef.current.BTC.slice(-priceHistoryRef.current[symbol].length)
              );
              const ethCorr = calculateCorrelation(
                priceHistoryRef.current[symbol],
                priceHistoryRef.current.ETH.slice(-priceHistoryRef.current[symbol].length)
              );
              
              updateCorrelation(symbol, btcCorr, ethCorr);
            }
          }
          
          // Handle order book data
          if (data.e === 'depthUpdate' || data.lastUpdateId) {
            const orderBook = {
              bids: (data.bids || data.b || []).slice(0, 5).map(([price, qty]) => ({
                price: parseFloat(price),
                quantity: parseFloat(qty),
              })),
              asks: (data.asks || data.a || []).slice(0, 5).map(([price, qty]) => ({
                price: parseFloat(price),
                quantity: parseFloat(qty),
              })),
            };
            
            updateOrderBook(symbol, orderBook);
          }
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setWsConnected(false);
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
        setWsConnected(false);
        
        // Attempt to reconnect after 3 seconds
        setTimeout(() => {
          if (coins.length > 0) {
            connectWebSocket();
          }
        }, 3000);
      };
    };

    connectWebSocket();

    // Cleanup on unmount or when coins change
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [coins.map(c => c.ticker).join(',')]); // Re-connect when coin list changes

  return null;
};

// Hook to fetch historical data and calculate ATH
export const useCoinData = (ticker) => {
  const { priceData } = useStore();
  const data = priceData[ticker];
  
  if (!data) return null;
  
  // Calculate distance to ATH (using 24h high as proxy)
  const distanceToATH = data.high24h > 0 
    ? ((data.high24h - data.price) / data.high24h) * 100 
    : 0;
  
  return {
    ...data,
    distanceToATH,
    isNearATH: distanceToATH < 5, // Within 5% of 24h high
  };
};
