'use client';

import { Market } from '@/types/market';
import { useState } from 'react';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

interface DetailSheetProps {
  market: Market;
  priceHistory: { day: number; price: number }[];
  onClose: () => void;
}

export default function DetailSheet({ market, priceHistory, onClose }: DetailSheetProps) {
  const [betAmount, setBetAmount] = useState<number>(5);
  const [selectedOutcome, setSelectedOutcome] = useState<'yes' | 'no'>('yes');

  const yesPrice = parseFloat(market.outcomePrices[0] || '0.5');
  const noPrice = parseFloat(market.outcomePrices[1] || '0.5');
  const yesPercent = Math.round(yesPrice * 100);
  const noPercent = Math.round(noPrice * 100);

  // Calculate stats from price history
  const prices = priceHistory.map(p => p.price);
  const allTimeHigh = Math.round(Math.max(...prices));
  const allTimeLow = Math.round(Math.min(...prices));
  const avgPrice = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length * 10) / 10;
  
  // Volatility (standard deviation)
  const mean = prices.reduce((a, b) => a + b, 0) / prices.length;
  const variance = prices.reduce((acc, p) => acc + Math.pow(p - mean, 2), 0) / prices.length;
  const volatility = Math.round(Math.sqrt(variance) * 10) / 10;

  // 6-month change (mock)
  const firstPrice = prices[0];
  const lastPrice = prices[prices.length - 1];
  const change = Math.round(((lastPrice - firstPrice) / firstPrice) * 100);

  // Mock stats
  const totalPool = parseFloat(market.volume) || 4800000;
  const bettors = Math.floor(totalPool / 26);
  const daysRemaining = market.endDate 
    ? Math.max(0, Math.floor((new Date(market.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 180;
  const trend = change > 0 ? 'Bullish' : change < 0 ? 'Bearish' : 'Neutral';

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const potentialReturn = selectedOutcome === 'yes' 
    ? (betAmount / yesPrice).toFixed(2)
    : (betAmount / noPrice).toFixed(2);

  // Format price history for chart with month labels
  const chartData = priceHistory.map((p, i) => ({
    ...p,
    month: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'][Math.floor(i / 5)] || ''
  }));

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pt-6">
        <button onClick={onClose} className="p-2 -ml-2">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <span className="text-red-500 text-sm font-medium flex items-center gap-2">
          <span className="w-2 h-2 bg-red-500 rounded-full" />
          {market.category || 'MARKET'}
        </span>
        <div className="w-10" /> {/* Spacer */}
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-4 pb-32">
        {/* Question */}
        <h1 className="text-white text-xl font-bold mb-4">
          {market.question}
        </h1>

        {/* Current Price + Change */}
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-zinc-500 text-sm mb-1">Current</p>
            <div className="flex items-baseline gap-2">
              <span className="text-white text-4xl font-bold">{yesPercent}%</span>
              <span className="text-green-400 text-lg font-semibold">YES</span>
            </div>
          </div>
          <div className="text-right">
            <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-semibold ${
              change >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
            }`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={
                  change >= 0 ? "M7 17l9.2-9.2M17 17V7H7" : "M17 7l-9.2 9.2M7 7v10h10"
                } />
              </svg>
              {change >= 0 ? '+' : ''}{change}%
            </span>
            <p className="text-zinc-500 text-xs mt-1">6-month change</p>
          </div>
        </div>

        {/* Price Chart */}
        <div className="bg-zinc-900/50 rounded-2xl p-4 mb-6">
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <defs>
                  <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#71717a', fontSize: 12 }}
                  interval={4}
                />
                <YAxis 
                  domain={[0, 15]}
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: '#71717a', fontSize: 12 }}
                  tickFormatter={(v) => `${v}%`}
                  width={40}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-zinc-800 px-3 py-2 rounded-lg text-white text-sm">
                          {Math.round(payload[0].value as number)}%
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: '#ef4444' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Key Statistics */}
        <h2 className="text-zinc-500 text-sm font-medium mb-3 tracking-wider">KEY STATISTICS</h2>
        
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-zinc-900/50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </div>
            <p className="text-white text-2xl font-bold">{allTimeHigh}%</p>
            <p className="text-zinc-500 text-sm">All-Time High</p>
          </div>
          
          <div className="bg-zinc-900/50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
            <p className="text-white text-2xl font-bold">{allTimeLow}%</p>
            <p className="text-zinc-500 text-sm">All-Time Low</p>
          </div>
          
          <div className="bg-zinc-900/50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 13h2v8H3v-8zm4-4h2v12H7V9zm4-4h2v16h-2V5zm4 8h2v8h-2v-8zm4-4h2v12h-2V9z"/>
              </svg>
            </div>
            <p className="text-white text-2xl font-bold">{avgPrice}%</p>
            <p className="text-zinc-500 text-sm">6M Average</p>
          </div>
          
          <div className="bg-zinc-900/50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <p className="text-white text-2xl font-bold">{volatility}pts</p>
            <p className="text-zinc-500 text-sm">Volatility</p>
          </div>
        </div>

        {/* More Stats */}
        <div className="bg-zinc-900/50 rounded-xl divide-y divide-zinc-800">
          <div className="flex justify-between items-center p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                <span className="text-green-500">$</span>
              </div>
              <span className="text-white">Total Pool</span>
            </div>
            <span className="text-white font-semibold">{formatNumber(totalPool)}</span>
          </div>
          
          <div className="flex justify-between items-center p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                </svg>
              </div>
              <span className="text-white">Bettors</span>
            </div>
            <span className="text-white font-semibold">{formatNumber(bettors)}</span>
          </div>
          
          <div className="flex justify-between items-center p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-white">Time Remaining</span>
            </div>
            <span className="text-white font-semibold">{daysRemaining}d</span>
          </div>
          
          <div className="flex justify-between items-center p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <span className="text-white">Trend</span>
            </div>
            <span className={`font-semibold ${trend === 'Bullish' ? 'text-green-400' : trend === 'Bearish' ? 'text-red-400' : 'text-zinc-400'}`}>
              {trend}
            </span>
          </div>
        </div>
      </div>

      {/* Fixed Bottom - Bet Section */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-lg border-t border-zinc-800 p-4 pb-8">
        {/* Amount selector */}
        <div className="flex gap-2 mb-4">
          {[1, 5, 10, 25, 100].map((amount) => (
            <button
              key={amount}
              onClick={() => setBetAmount(amount)}
              className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                betAmount === amount 
                  ? 'bg-white text-black' 
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
              }`}
            >
              ${amount}
            </button>
          ))}
        </div>

        {/* Outcome selector + Place bet */}
        <div className="flex gap-3">
          <button
            onClick={() => setSelectedOutcome('yes')}
            className={`flex-1 py-4 rounded-full font-bold transition-all ${
              selectedOutcome === 'yes'
                ? 'bg-green-500 text-black'
                : 'bg-zinc-800 text-zinc-400'
            }`}
          >
            YES · {yesPercent}%
          </button>
          <button
            onClick={() => setSelectedOutcome('no')}
            className={`flex-1 py-4 rounded-full font-bold transition-all ${
              selectedOutcome === 'no'
                ? 'bg-red-500 text-white'
                : 'bg-zinc-800 text-zinc-400'
            }`}
          >
            NO · {noPercent}%
          </button>
        </div>

        <p className="text-center text-zinc-500 text-sm mt-3">
          Potential return: <span className="text-white font-semibold">${potentialReturn}</span>
        </p>
      </div>
    </div>
  );
}
