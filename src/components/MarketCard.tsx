'use client';

import { Market } from '@/types/market';
import { useState, ReactNode } from 'react';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';
import DetailSheet from './DetailSheet';

interface MarketCardProps {
  market: Market;
  isActive: boolean;
}

// Generate mock price history
function generatePriceHistory(currentPrice: number) {
  const data = [];
  let price = currentPrice * (0.5 + Math.random() * 0.5);
  for (let i = 0; i < 30; i++) {
    price = Math.max(0.01, Math.min(0.99, price + (Math.random() - 0.5) * 0.08));
    data.push({ day: i, price: price * 100 });
  }
  // End at current price
  data.push({ day: 30, price: currentPrice * 100 });
  return data;
}

// Get market image based on keywords
function getMarketImage(market: Market): string {
  const q = market.question.toLowerCase();
  if (q.includes('bitcoin') || q.includes('btc')) return 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=800&h=1200&fit=crop';
  if (q.includes('ethereum') || q.includes('eth')) return 'https://images.unsplash.com/photo-1622630998477-20aa696ecb05?w=800&h=1200&fit=crop';
  if (q.includes('trump')) return 'https://images.unsplash.com/photo-1580128660010-fd027e1e587a?w=800&h=1200&fit=crop';
  if (q.includes('election')) return 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=800&h=1200&fit=crop';
  if (q.includes('fed') || q.includes('rate')) return 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=1200&fit=crop';
  if (q.includes('ai') || q.includes('openai') || q.includes('gpt')) return 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=1200&fit=crop';
  if (q.includes('taylor')) return 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=1200&fit=crop';
  return 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=1200&fit=crop';
}

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

export default function MarketCard({ market, isActive }: MarketCardProps) {
  const [showDetail, setShowDetail] = useState(false);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  const yesPrice = parseFloat(market.outcomePrices[0] || '0.5');
  const noPrice = parseFloat(market.outcomePrices[1] || '0.5');
  const yesPercent = Math.round(yesPrice * 100);
  const noPercent = Math.round(noPrice * 100);

  const priceHistory = generatePriceHistory(yesPrice);
  const bgImage = getMarketImage(market);
  
  // Mock social stats
  const likes = Math.floor(parseFloat(market.volume) / 100) || 12500;
  const comments = Math.floor(likes * 0.55);
  const shares = Math.floor(likes * 0.38);
  
  // Mock stats
  const daysRemaining = market.endDate 
    ? Math.max(0, Math.floor((new Date(market.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 180;

  const formatVolume = (vol: string) => {
    const num = parseFloat(vol);
    if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return `$${num.toFixed(0)}`;
  };

  return (
    <>
      <div className="h-full w-full bg-black flex flex-col relative overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${bgImage})` }}
        >
          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/95" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/50" />
        </div>

        {/* Header */}
        <div className="relative z-10 flex justify-between items-center p-4 pt-6">
          <button className="p-2">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>
          
          <span className="bg-black/50 backdrop-blur-sm text-white text-xs font-medium px-4 py-2 rounded-full flex items-center gap-2">
            <span className="w-2 h-2 bg-red-500 rounded-full" />
            {market.category || 'Market'}
          </span>
          
          <button className="p-2">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>

        {/* Right Sidebar */}
        <div className="absolute right-3 top-1/3 z-20 flex flex-col items-center gap-5">
          {/* HOT indicator */}
          <div className="flex flex-col items-center">
            <span className="text-orange-500 text-xs font-bold mb-1">HOT</span>
            <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center">
              <span className="text-orange-500">🔥</span>
            </div>
          </div>
          
          {/* Likes */}
          <button 
            className="flex flex-col items-center"
            onClick={() => setLiked(!liked)}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${liked ? 'bg-red-500' : 'bg-white/10'}`}>
              <svg className={`w-6 h-6 ${liked ? 'text-white fill-current' : 'text-white'}`} fill={liked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <span className="text-white text-xs mt-1">{formatNumber(likes)}</span>
          </button>
          
          {/* Comments */}
          <button 
            className="flex flex-col items-center"
            onClick={() => setShowDetail(true)}
          >
            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <span className="text-white text-xs mt-1">{formatNumber(comments)}</span>
          </button>
          
          {/* Shares */}
          <button className="flex flex-col items-center">
            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </div>
            <span className="text-white text-xs mt-1">{formatNumber(shares)}</span>
          </button>
          
          {/* Save */}
          <button 
            className="flex flex-col items-center"
            onClick={() => setSaved(!saved)}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${saved ? 'bg-yellow-500' : 'bg-white/10'}`}>
              <svg className={`w-6 h-6 ${saved ? 'text-white fill-current' : 'text-white'}`} fill={saved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </div>
            <span className="text-white text-xs mt-1">Save</span>
          </button>
        </div>

        {/* Main Content - Bottom Section */}
        <div className="flex-1" />
        
        <div className="relative z-10 p-4 pb-24">
          {/* Trending badge */}
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-green-500/20 text-green-400 text-xs font-semibold px-2 py-1 rounded flex items-center gap-1">
              <span>📈</span> TRENDING
            </span>
          </div>

          {/* Question */}
          <h1 className="text-white text-xl font-bold mb-3 leading-tight pr-12">
            {market.question}
          </h1>

          {/* Mini Chart + Stats Row */}
          <div className="flex items-center gap-3 mb-4">
            {/* Mini chart */}
            <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm rounded-full px-3 py-1.5">
              <div className="w-16 h-6">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={priceHistory.slice(-10)}>
                    <Line 
                      type="monotone" 
                      dataKey="price" 
                      stroke={yesPercent > 50 ? '#22c55e' : '#ef4444'}
                      strokeWidth={1.5}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <span className={`text-sm font-semibold ${yesPercent > 50 ? 'text-green-400' : 'text-red-400'}`}>
                {yesPercent}% YES
              </span>
            </div>

            {/* Time */}
            <div className="flex items-center gap-1 text-zinc-400 text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{daysRemaining}d</span>
            </div>

            {/* Volume */}
            <div className="flex items-center gap-1 text-zinc-400 text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span>{formatVolume(market.volume)}</span>
            </div>
          </div>

          {/* Buy buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => setShowDetail(true)}
              className="flex-1 bg-green-500/90 hover:bg-green-500 text-black font-bold py-3.5 px-6 rounded-full transition-all flex items-center justify-center gap-2"
            >
              <span className="w-2 h-2 bg-green-900 rounded-full" />
              YES · {yesPercent}%
            </button>
            <button
              onClick={() => setShowDetail(true)}
              className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-bold py-3.5 px-6 rounded-full border border-red-500/30 transition-all flex items-center justify-center gap-2"
            >
              <span className="w-2 h-2 bg-red-500 rounded-full" />
              NO · {noPercent}%
            </button>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="absolute bottom-0 left-0 right-0 z-30 bg-black/80 backdrop-blur-lg border-t border-white/10">
          <div className="flex justify-around items-center py-3 px-4">
            <button className="flex flex-col items-center text-white">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
              </svg>
              <span className="text-xs mt-1">Home</span>
            </button>
            <button className="flex flex-col items-center text-zinc-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <span className="text-xs mt-1">Feed</span>
            </button>
            <button className="flex flex-col items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center -mt-4 shadow-lg shadow-green-500/30">
                <svg className="w-7 h-7 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
              </div>
            </button>
            <button className="flex flex-col items-center text-zinc-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span className="text-xs mt-1">Ranking</span>
            </button>
            <button className="flex flex-col items-center text-zinc-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-xs mt-1">Profile</span>
            </button>
          </div>
        </div>
      </div>

      {/* Detail Sheet */}
      {showDetail && (
        <DetailSheet 
          market={market} 
          priceHistory={priceHistory}
          onClose={() => setShowDetail(false)} 
        />
      )}
    </>
  );
}
