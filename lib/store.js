import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Sector mapping for auto-categorization
const SECTOR_KEYWORDS = {
  L1: ['btc', 'eth', 'sol', 'ada', 'dot', 'avax', 'near', 'atom', 'ftm', 'algo'],
  L2: ['arb', 'op', 'matic', 'polygon', 'zksync', 'starknet', 'imx', 'loopring'],
  DePIN: ['hnt', 'rndr', 'theta', 'fil', 'storj', 'grt', 'ocean', 'akash'],
  Memes: ['doge', 'shib', 'pepe', 'bonk', 'floki', 'babydoge', 'wojak'],
  DeFi: ['uni', 'aave', 'comp', 'mkr', 'crv', 'snx', 'sushi', 'cake'],
  Gaming: ['axs', 'sand', 'mana', 'gala', 'enj', 'ron', 'ilv'],
  AI: ['fet', 'agix', 'ocean', 'render', 'phala'],
  Stablecoin: ['usdt', 'usdc', 'busd', 'dai', 'frax', 'tusd'],
};

const determineSector = (ticker) => {
  const lowerTicker = ticker.toLowerCase();
  for (const [sector, keywords] of Object.entries(SECTOR_KEYWORDS)) {
    if (keywords.some(keyword => lowerTicker.includes(keyword))) {
      return sector;
    }
  }
  return 'Other';
};

const useStore = create(
  persist(
    (set, get) => ({
      // Coin data
      coins: [],
      
      // Live price data from WebSocket
      priceData: {},
      
      // Order book data
      orderBooks: {},
      
      // Filters and sorting
      sortBy: 'probability',
      filterSector: 'all',
      probabilityDecay: false,
      
      // Admin access
      isAdminAuthenticated: false,
      
      // WebSocket connection status
      wsConnected: false,
      
      // Actions
      addCoin: (ticker, probabilityScore, setupGrade, notes) => {
        const coins = get().coins;
        const existingIndex = coins.findIndex(c => c.ticker === ticker.toUpperCase());
        
        const coinData = {
          ticker: ticker.toUpperCase(),
          probabilityScore: probabilityScore || 50,
          setupGrade: setupGrade || 'B',
          sector: determineSector(ticker),
          addedAt: Date.now(),
          lastUpdated: Date.now(),
          notes: notes || '',
          btcCorrelation: 0,
          ethCorrelation: 0,
        };
        
        if (existingIndex >= 0) {
          // Update existing coin
          const newCoins = [...coins];
          newCoins[existingIndex] = { ...newCoins[existingIndex], ...coinData, lastUpdated: Date.now() };
          set({ coins: newCoins });
        } else {
          // Add new coin
          set({ coins: [...coins, coinData] });
        }
      },
      
      addBulkCoins: (tickers) => {
        const tickerArray = tickers.split(',').map(t => t.trim().toUpperCase()).filter(Boolean);
        const existingTickers = new Set(get().coins.map(c => c.ticker));
        
        const newCoins = tickerArray
          .filter(ticker => !existingTickers.has(ticker))
          .map(ticker => ({
            ticker,
            probabilityScore: 50,
            setupGrade: 'B',
            sector: determineSector(ticker),
            addedAt: Date.now(),
            lastUpdated: Date.now(),
            notes: '',
            btcCorrelation: 0,
            ethCorrelation: 0,
          }));
        
        set({ coins: [...get().coins, ...newCoins] });
      },
      
      removeCoin: (ticker) => {
        set({ coins: get().coins.filter(c => c.ticker !== ticker) });
      },
      
      updateCoinProbability: (ticker, probabilityScore) => {
        const coins = get().coins.map(coin => 
          coin.ticker === ticker 
            ? { ...coin, probabilityScore, lastUpdated: Date.now() }
            : coin
        );
        set({ coins });
      },
      
      updateCoinGrade: (ticker, setupGrade) => {
        const coins = get().coins.map(coin => 
          coin.ticker === ticker 
            ? { ...coin, setupGrade, lastUpdated: Date.now() }
            : coin
        );
        set({ coins });
      },
      
      updateCoinNotes: (ticker, notes) => {
        const coins = get().coins.map(coin => 
          coin.ticker === ticker 
            ? { ...coin, notes, lastUpdated: Date.now() }
            : coin
        );
        set({ coins });
      },
      
      refreshCoin: (ticker) => {
        const coins = get().coins.map(coin => 
          coin.ticker === ticker 
            ? { ...coin, lastUpdated: Date.now() }
            : coin
        );
        set({ coins });
      },
      
      updatePriceData: (ticker, data) => {
        set(state => ({
          priceData: {
            ...state.priceData,
            [ticker]: {
              ...state.priceData[ticker],
              ...data,
              lastUpdate: Date.now(),
            }
          }
        }));
      },
      
      updateOrderBook: (ticker, orderBook) => {
        set(state => ({
          orderBooks: {
            ...state.orderBooks,
            [ticker]: orderBook,
          }
        }));
      },
      
      updateCorrelation: (ticker, btcCorrelation, ethCorrelation) => {
        const coins = get().coins.map(coin => 
          coin.ticker === ticker 
            ? { ...coin, btcCorrelation, ethCorrelation }
            : coin
        );
        set({ coins });
      },
      
      setSortBy: (sortBy) => set({ sortBy }),
      
      setFilterSector: (filterSector) => set({ filterSector }),
      
      toggleProbabilityDecay: () => set({ probabilityDecay: !get().probabilityDecay }),
      
      setAdminAuthenticated: (value) => set({ isAdminAuthenticated: value }),
      
      setWsConnected: (value) => set({ wsConnected: value }),
      
      // Probability decay logic
      applyProbabilityDecay: () => {
        const now = Date.now();
        const DECAY_RATE = 0.02; // 2% per hour
        const HOUR_MS = 3600000;
        
        const coins = get().coins.map(coin => {
          const hoursSinceUpdate = (now - coin.lastUpdated) / HOUR_MS;
          const decayAmount = hoursSinceUpdate * DECAY_RATE * 100;
          const newProbability = Math.max(0, coin.probabilityScore - decayAmount);
          
          return {
            ...coin,
            probabilityScore: get().probabilityDecay ? newProbability : coin.probabilityScore,
          };
        });
        
        set({ coins });
      },
      
      // Get sorted and filtered coins
      getFilteredCoins: () => {
        const { coins, sortBy, filterSector } = get();
        
        let filtered = [...coins];
        
        // Apply sector filter
        if (filterSector !== 'all') {
          filtered = filtered.filter(coin => coin.sector === filterSector);
        }
        
        // Apply sorting
        switch (sortBy) {
          case 'probability':
            filtered.sort((a, b) => b.probabilityScore - a.probabilityScore);
            break;
          case 'grade':
            const gradeOrder = { 'A': 3, 'B': 2, 'C': 1 };
            filtered.sort((a, b) => gradeOrder[b.setupGrade] - gradeOrder[a.setupGrade]);
            break;
          case 'recent':
            filtered.sort((a, b) => b.addedAt - a.addedAt);
            break;
          case 'sector':
            filtered.sort((a, b) => a.sector.localeCompare(b.sector));
            break;
          default:
            break;
        }
        
        return filtered;
      },
    }),
    {
      name: 'cointracker-storage',
      partialize: (state) => ({
        coins: state.coins,
        sortBy: state.sortBy,
        filterSector: state.filterSector,
        probabilityDecay: state.probabilityDecay,
      }),
    }
  )
);

export default useStore;
