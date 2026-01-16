'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../lib/store';
import OrderBook from './OrderBook';

const Modal = ({ isOpen, onClose, coin, coinData }) => {
  const { updateCoinProbability, updateCoinGrade, updateCoinNotes } = useStore();
  const [probability, setProbability] = useState(coin.probabilityScore);
  const [grade, setGrade] = useState(coin.setupGrade);
  const [notes, setNotes] = useState(coin.notes);
  const [timeframe, setTimeframe] = useState('1h');

  useEffect(() => {
    setProbability(coin.probabilityScore);
    setGrade(coin.setupGrade);
    setNotes(coin.notes);
  }, [coin]);

  const handleSave = () => {
    updateCoinProbability(coin.ticker, probability);
    updateCoinGrade(coin.ticker, grade);
    updateCoinNotes(coin.ticker, notes);
    onClose();
  };

  const formatPrice = (price) => {
    if (!price) return '0.00';
    if (price < 0.01) return price.toFixed(6);
    if (price < 1) return price.toFixed(4);
    return price.toFixed(2);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-terminal-dark border-2 border-neon-emerald rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden shadow-2xl shadow-neon-emerald/20"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-terminal-border bg-gradient-to-r from-neon-emerald/5 to-transparent">
              <div>
                <h2 className="text-3xl font-display font-bold text-white flex items-center gap-3">
                  {coin.ticker}
                  <span className="text-sm font-mono text-gray-500">/USDT</span>
                  <span className={`text-lg px-3 py-1 rounded border-2 ${
                    grade === 'A' ? 'border-neon-gold text-neon-gold' :
                    grade === 'B' ? 'border-neon-emerald text-neon-emerald' :
                    'border-neon-blue text-neon-blue'
                  }`}>
                    Grade {grade}
                  </span>
                </h2>
                {coinData && (
                  <div className="mt-2 flex items-center gap-6">
                    <div className={`text-2xl font-mono font-bold ${
                      coinData.priceChangePercent24h > 0 ? 'text-neon-emerald' : 'text-neon-crimson'
                    }`}>
                      ${formatPrice(coinData.price)}
                    </div>
                    <div className={`text-sm ${
                      coinData.priceChangePercent24h > 0 ? 'text-neon-emerald' : 'text-neon-crimson'
                    }`}>
                      {coinData.priceChangePercent24h > 0 ? '▲' : '▼'} {Math.abs(coinData.priceChangePercent24h).toFixed(2)}%
                    </div>
                  </div>
                )}
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white text-3xl font-bold transition-colors"
              >
                ×
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-120px)] p-6">
              <div className="grid grid-cols-3 gap-6">
                {/* Left column - Chart */}
                <div className="col-span-2 space-y-6">
                  {/* Timeframe selector */}
                  <div className="flex gap-2">
                    {['15m', '1h', '4h', '1d'].map(tf => (
                      <button
                        key={tf}
                        onClick={() => setTimeframe(tf)}
                        className={`px-4 py-2 rounded text-sm font-mono transition-colors ${
                          timeframe === tf
                            ? 'bg-neon-emerald text-terminal-black'
                            : 'bg-terminal-accent text-gray-400 hover:text-white'
                        }`}
                      >
                        {tf}
                      </button>
                    ))}
                  </div>

                  {/* TradingView Chart Placeholder */}
                  <div className="bg-terminal-accent/30 rounded-lg p-6 border border-terminal-border">
                    <div className="aspect-video flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-neon-emerald text-xl mb-2">📈</div>
                        <p className="text-gray-400 text-sm">
                          TradingView Chart - {coin.ticker}/USDT
                        </p>
                        <p className="text-gray-600 text-xs mt-1">
                          Timeframe: {timeframe}
                        </p>
                        <a
                          href={`https://www.tradingview.com/chart/?symbol=BINANCE:${coin.ticker}USDT`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block mt-4 px-4 py-2 bg-neon-emerald/10 hover:bg-neon-emerald/20 text-neon-emerald rounded text-sm transition-colors"
                        >
                          Open in TradingView →
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Statistics Grid */}
                  {coinData && (
                    <div className="grid grid-cols-4 gap-4">
                      <div className="bg-terminal-accent/50 rounded p-4">
                        <div className="text-xs text-gray-500 mb-1">24h High</div>
                        <div className="text-lg font-mono text-neon-emerald tabular-nums">
                          ${formatPrice(coinData.high24h)}
                        </div>
                      </div>
                      <div className="bg-terminal-accent/50 rounded p-4">
                        <div className="text-xs text-gray-500 mb-1">24h Low</div>
                        <div className="text-lg font-mono text-neon-crimson tabular-nums">
                          ${formatPrice(coinData.low24h)}
                        </div>
                      </div>
                      <div className="bg-terminal-accent/50 rounded p-4">
                        <div className="text-xs text-gray-500 mb-1">24h Volume</div>
                        <div className="text-lg font-mono text-neon-gold tabular-nums">
                          {coinData.volume24h >= 1e6 
                            ? `${(coinData.volume24h / 1e6).toFixed(2)}M`
                            : `${(coinData.volume24h / 1e3).toFixed(2)}K`
                          }
                        </div>
                      </div>
                      <div className="bg-terminal-accent/50 rounded p-4">
                        <div className="text-xs text-gray-500 mb-1">Distance to ATH</div>
                        <div className={`text-lg font-mono tabular-nums ${
                          coinData.isNearATH ? 'text-neon-gold' : 'text-gray-300'
                        }`}>
                          {coinData.distanceToATH.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Order Book */}
                  <div className="bg-terminal-accent/30 rounded-lg p-6 border border-terminal-border">
                    <OrderBook ticker={coin.ticker} mini={false} />
                  </div>
                </div>

                {/* Right column - Controls & Notes */}
                <div className="space-y-6">
                  {/* Probability Score */}
                  <div className="bg-terminal-accent/30 rounded-lg p-6 border border-terminal-border">
                    <label className="block text-sm text-gray-400 mb-3">
                      Probability Score
                    </label>
                    <div className="flex items-center gap-3 mb-3">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={probability}
                        onChange={(e) => setProbability(parseFloat(e.target.value))}
                        className="flex-1 h-2 bg-terminal-border rounded-lg appearance-none cursor-pointer"
                        style={{
                          background: `linear-gradient(to right, #EF4444 0%, #F59E0B 50%, #10B981 100%)`,
                        }}
                      />
                      <span className="text-2xl font-bold text-neon-emerald w-16 text-right">
                        {probability.toFixed(0)}%
                      </span>
                    </div>
                    <div className="h-2 bg-terminal-accent rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-neon-crimson via-neon-gold to-neon-emerald transition-all"
                        style={{ width: `${probability}%` }}
                      />
                    </div>
                  </div>

                  {/* Setup Grade */}
                  <div className="bg-terminal-accent/30 rounded-lg p-6 border border-terminal-border">
                    <label className="block text-sm text-gray-400 mb-3">
                      Setup Grade
                    </label>
                    <div className="flex gap-2">
                      {['A', 'B', 'C'].map(g => (
                        <button
                          key={g}
                          onClick={() => setGrade(g)}
                          className={`flex-1 py-3 rounded font-bold text-lg transition-all ${
                            grade === g
                              ? g === 'A' ? 'bg-neon-gold text-terminal-black border-2 border-neon-gold'
                              : g === 'B' ? 'bg-neon-emerald text-terminal-black border-2 border-neon-emerald'
                              : 'bg-neon-blue text-terminal-black border-2 border-neon-blue'
                              : 'bg-terminal-accent text-gray-400 border-2 border-terminal-border hover:border-gray-600'
                          }`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Correlations */}
                  <div className="bg-terminal-accent/30 rounded-lg p-6 border border-terminal-border">
                    <h4 className="text-sm text-gray-400 mb-3">Market Correlations</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-500">BTC Beta</span>
                          <span className={`font-mono font-bold ${
                            Math.abs(coin.btcCorrelation) > 0.7 ? 'text-neon-emerald' : 'text-gray-400'
                          }`}>
                            {coin.btcCorrelation.toFixed(3)}
                          </span>
                        </div>
                        <div className="h-2 bg-terminal-border rounded-full overflow-hidden">
                          <div
                            className="h-full bg-neon-emerald transition-all"
                            style={{ width: `${Math.abs(coin.btcCorrelation) * 100}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-500">ETH Beta</span>
                          <span className={`font-mono font-bold ${
                            Math.abs(coin.ethCorrelation) > 0.7 ? 'text-neon-emerald' : 'text-gray-400'
                          }`}>
                            {coin.ethCorrelation.toFixed(3)}
                          </span>
                        </div>
                        <div className="h-2 bg-terminal-border rounded-full overflow-hidden">
                          <div
                            className="h-full bg-neon-blue transition-all"
                            style={{ width: `${Math.abs(coin.ethCorrelation) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Research Notes */}
                  <div className="bg-terminal-accent/30 rounded-lg p-6 border border-terminal-border">
                    <label className="block text-sm text-gray-400 mb-3">
                      Research Notes
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add your research notes, catalyst events, or setup details..."
                      className="w-full h-32 bg-terminal-dark border border-terminal-border rounded p-3 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-neon-emerald resize-none"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={handleSave}
                      className="flex-1 py-3 bg-neon-emerald hover:bg-neon-emerald/80 text-terminal-black font-bold rounded transition-colors"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={onClose}
                      className="px-6 py-3 bg-terminal-accent hover:bg-terminal-border text-gray-300 font-bold rounded transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
