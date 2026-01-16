'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../lib/store';
import { useBinanceWebSocket } from '../lib/websocket';
import PriceCard from '../components/PriceCard';
import AdminPanel from '../components/AdminPanel';
import './globals.css';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const { 
    coins, 
    sortBy, 
    filterSector, 
    probabilityDecay,
    setSortBy, 
    setFilterSector, 
    toggleProbabilityDecay,
    applyProbabilityDecay,
    getFilteredCoins,
    wsConnected 
  } = useStore();

  // Initialize WebSocket connection
  useBinanceWebSocket();

  useEffect(() => {
    setMounted(true);

    // Apply probability decay every hour if enabled
    const decayInterval = setInterval(() => {
      if (probabilityDecay) {
        applyProbabilityDecay();
      }
    }, 3600000); // 1 hour

    return () => clearInterval(decayInterval);
  }, [probabilityDecay]);

  if (!mounted) return null;

  const filteredCoins = getFilteredCoins();
  const sectors = ['all', ...new Set(coins.map(c => c.sector))];

  return (
    <div className="min-h-screen bg-terminal-black text-white scanline">
      {/* Background grid */}
      <div className="fixed inset-0 grid-bg opacity-20 pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-30 backdrop-blur-terminal border-b border-terminal-border">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4"
            >
              <div className="text-3xl font-display font-black text-neon-emerald">
                <span className="text-white">CRYPTO</span>
                <span className="text-neon-emerald">INTEL</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-terminal-accent rounded">
                <div className={`w-2 h-2 rounded-full ${wsConnected ? 'bg-neon-emerald' : 'bg-neon-crimson'} animate-pulse`} />
                <span className="text-xs text-gray-400">
                  {wsConnected ? 'LIVE' : 'OFFLINE'}
                </span>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-6 text-sm font-mono"
            >
              <div className="text-gray-400">
                Total Assets: <span className="text-white font-bold">{coins.length}</span>
              </div>
              <div className="text-gray-400">
                High Probability: <span className="text-neon-emerald font-bold">
                  {coins.filter(c => c.probabilityScore >= 70).length}
                </span>
              </div>
              <div className="text-gray-400">
                Grade A: <span className="text-neon-gold font-bold">
                  {coins.filter(c => c.setupGrade === 'A').length}
                </span>
              </div>
            </motion.div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4 mt-4">
            {/* Sort By */}
            <div className="flex items-center gap-2">
              <label className="text-xs text-gray-500 uppercase">Sort:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-terminal-accent border border-terminal-border rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-neon-emerald cursor-pointer"
              >
                <option value="probability">Probability ↓</option>
                <option value="grade">Grade (A-C)</option>
                <option value="recent">Recently Added</option>
                <option value="sector">Sector</option>
              </select>
            </div>

            {/* Filter Sector */}
            <div className="flex items-center gap-2">
              <label className="text-xs text-gray-500 uppercase">Sector:</label>
              <div className="flex gap-1">
                {sectors.map(sector => (
                  <button
                    key={sector}
                    onClick={() => setFilterSector(sector)}
                    className={`px-3 py-1.5 text-xs rounded transition-all ${
                      filterSector === sector
                        ? 'bg-neon-emerald text-terminal-black font-bold'
                        : 'bg-terminal-accent text-gray-400 hover:bg-terminal-border'
                    }`}
                  >
                    {sector.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Probability Decay Toggle */}
            <div className="flex items-center gap-2 ml-auto">
              <label className="text-xs text-gray-500 uppercase">Auto Decay:</label>
              <button
                onClick={toggleProbabilityDecay}
                className={`px-3 py-1.5 text-xs rounded font-semibold transition-all ${
                  probabilityDecay
                    ? 'bg-neon-emerald text-terminal-black'
                    : 'bg-terminal-accent text-gray-400'
                }`}
              >
                {probabilityDecay ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {coins.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center min-h-[60vh]"
          >
            <div className="text-6xl mb-4">📊</div>
            <h2 className="text-2xl font-display font-bold text-white mb-2">
              Welcome to CryptoIntel
            </h2>
            <p className="text-gray-400 text-center max-w-md mb-6">
              Start building your watchlist by clicking the green + button in the bottom right corner.
              Add coins individually or in bulk to track their performance and probability scores.
            </p>
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <span>💡 Tip:</span>
              <span>Use BTC, ETH, SOL for quick testing</span>
            </div>
          </motion.div>
        ) : filteredCoins.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-white mb-2">No coins match your filters</h3>
            <p className="text-gray-400">Try adjusting your sector filter or sort options</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredCoins.map((coin) => (
                <PriceCard key={coin.ticker} coin={coin} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-terminal-border mt-20">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-4">
              <span>CryptoIntel Pro</span>
              <span>•</span>
              <span>Real-time Market Data</span>
              <span>•</span>
              <span>Powered by Binance</span>
            </div>
            <div className="flex items-center gap-2">
              <span>Last Updated:</span>
              <span className="font-mono text-gray-400">
                {new Date().toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* Admin Panel */}
      <AdminPanel />
    </div>
  );
}
