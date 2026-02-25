'use client';

import { Market } from '@/types/market';
import { useState, ReactNode } from 'react';

interface MarketCardProps {
  market: Market;
  isActive: boolean;
}

// Simple icon mapping based on category/keywords
function getMarketIcon(market: Market): string {
  const q = market.question.toLowerCase();
  if (q.includes('bitcoin') || q.includes('btc')) return '₿';
  if (q.includes('ethereum') || q.includes('eth')) return 'Ξ';
  if (q.includes('trump') || q.includes('biden') || q.includes('election')) return '🗳️';
  if (q.includes('fed') || q.includes('rate') || q.includes('inflation')) return '📊';
  if (q.includes('ai') || q.includes('openai') || q.includes('gpt')) return '🤖';
  if (q.includes('sports') || q.includes('nfl') || q.includes('nba')) return '🏆';
  if (market.category?.toLowerCase().includes('crypto')) return '🪙';
  if (market.category?.toLowerCase().includes('politic')) return '🏛️';
  return '📈';
}

// Highlight numbers/values in question
function highlightQuestion(question: string): ReactNode {
  // Match dollar amounts, percentages, dates, and key numbers
  const regex = /(\$[\d,.]+[KkMmBb]?|\d+%|\d{1,2}(?:st|nd|rd|th)|\b\d{4}\b)/g;
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let match;
  
  while ((match = regex.exec(question)) !== null) {
    // Add text before match
    if (match.index > lastIndex) {
      parts.push(question.slice(lastIndex, match.index));
    }
    // Add highlighted match
    parts.push(
      <span key={match.index} className="text-red-500">{match[0]}</span>
    );
    lastIndex = regex.lastIndex;
  }
  
  // Add remaining text
  if (lastIndex < question.length) {
    parts.push(question.slice(lastIndex));
  }
  
  return <>{parts}</>;
}

export default function MarketCard({ market, isActive }: MarketCardProps) {
  const [selectedOutcome, setSelectedOutcome] = useState<number | null>(null);
  const [betAmount, setBetAmount] = useState<number>(5);
  const [showBetModal, setShowBetModal] = useState(false);

  const yesPrice = parseFloat(market.outcomePrices[0] || '0.5');
  const noPrice = parseFloat(market.outcomePrices[1] || '0.5');
  const yesPercent = Math.round(yesPrice * 100);
  const noPercent = Math.round(noPrice * 100);
  const yesCents = Math.round(yesPrice * 100);
  const noCents = Math.round(noPrice * 100);

  const formatVolume = (vol: string) => {
    const num = parseFloat(vol);
    if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `$${(num / 1000).toFixed(0)}k`;
    return `$${num.toFixed(0)}`;
  };

  const handleBet = (outcome: number) => {
    setSelectedOutcome(outcome);
    setShowBetModal(true);
  };

  const executeBet = () => {
    alert(`Would bet $${betAmount} on ${selectedOutcome === 0 ? 'YES' : 'NO'}\n\nWallet integration coming soon!`);
    setShowBetModal(false);
  };

  const potentialWin = selectedOutcome !== null 
    ? (betAmount / (selectedOutcome === 0 ? yesPrice : noPrice)).toFixed(2)
    : '0';

  const icon = getMarketIcon(market);

  return (
    <div className="h-full w-full bg-black flex flex-col relative overflow-hidden">
      {/* Red/orange gradient glow at top */}
      <div className="absolute top-0 left-0 right-0 h-72 bg-gradient-to-b from-red-900/40 via-orange-900/20 to-transparent pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />
      
      {/* Header */}
      <div className="relative z-10 flex justify-between items-center p-5 pt-6">
        {/* Category tag */}
        <span className="bg-zinc-800/80 text-white text-xs font-medium px-4 py-2 rounded-full uppercase tracking-wider">
          {market.category || 'Market'}
        </span>
        
        {/* Live indicator */}
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <span className="text-red-500 text-sm font-semibold">LIVE</span>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-10">
        {/* Market icon */}
        <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center mb-6 text-2xl">
          {icon}
        </div>

        {/* Question */}
        <h1 className="text-white text-2xl md:text-3xl font-bold text-center mb-8 leading-tight max-w-sm">
          {highlightQuestion(market.question)}
        </h1>

        {/* Stats row */}
        <div className="flex justify-center gap-8 text-xs uppercase tracking-wider mb-8">
          <div className="text-center">
            <p className="text-zinc-500 mb-1">Volume</p>
            <p className="text-white font-semibold">{formatVolume(market.volume)}</p>
          </div>
          <div className="text-center">
            <p className="text-zinc-500 mb-1">Liquidity</p>
            <p className="text-white font-semibold">{formatVolume(market.liquidity)}</p>
          </div>
          {market.endDate && (
            <div className="text-center">
              <p className="text-zinc-500 mb-1">Ends</p>
              <p className="text-white font-semibold">
                {new Date(market.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom section */}
      <div className="relative z-10 p-5 pb-8">
        {/* YES/NO cards */}
        <div className="flex gap-3 mb-4">
          {/* YES card */}
          <div 
            className="flex-1 bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 cursor-pointer hover:border-green-500/50 transition-colors"
            onClick={() => handleBet(0)}
          >
            <p className="text-green-500 text-sm font-semibold mb-1">YES</p>
            <p className="text-white text-3xl font-bold">{yesPercent}%</p>
            <p className="text-zinc-500 text-sm">{yesCents}¢</p>
          </div>

          {/* NO card */}
          <div 
            className="flex-1 bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 cursor-pointer hover:border-red-500/50 transition-colors"
            onClick={() => handleBet(1)}
          >
            <p className="text-red-500 text-sm font-semibold mb-1">NO</p>
            <p className="text-white text-3xl font-bold">{noPercent}%</p>
            <p className="text-zinc-500 text-sm">{noCents}¢</p>
          </div>
        </div>

        {/* Buy buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => handleBet(0)}
            className="flex-1 bg-green-500 hover:bg-green-400 text-black font-bold py-4 px-6 rounded-full transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Buy YES
          </button>
          <button
            onClick={() => handleBet(1)}
            className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-red-500 font-bold py-4 px-6 rounded-full border border-zinc-700 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Buy NO
          </button>
        </div>
      </div>

      {/* Bet Modal */}
      {showBetModal && (
        <div className="fixed inset-0 bg-black/90 flex items-end justify-center z-50" onClick={() => setShowBetModal(false)}>
          <div 
            className="bg-zinc-900 w-full max-w-lg rounded-t-3xl p-6 pb-10 border-t border-zinc-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-1 bg-zinc-700 rounded-full mx-auto mb-6" />
            
            <h3 className="text-white text-xl font-bold mb-2 text-center">
              Buy {selectedOutcome === 0 ? 'YES' : 'NO'}
            </h3>
            <p className="text-zinc-500 text-center mb-6">
              @ {selectedOutcome === 0 ? yesCents : noCents}¢ per share
            </p>

            {/* Amount selector */}
            <div className="flex gap-2 mb-6">
              {[1, 5, 10, 25, 100].map((amount) => (
                <button
                  key={amount}
                  onClick={() => setBetAmount(amount)}
                  className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                    betAmount === amount 
                      ? selectedOutcome === 0 ? 'bg-green-500 text-black' : 'bg-red-500 text-white'
                      : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                  }`}
                >
                  ${amount}
                </button>
              ))}
            </div>

            {/* Potential return */}
            <div className="bg-zinc-800/50 rounded-2xl p-4 mb-6">
              <div className="flex justify-between text-zinc-400 mb-3">
                <span>You pay</span>
                <span className="text-white font-semibold">${betAmount} USDC</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Potential return</span>
                <span className={`font-bold ${selectedOutcome === 0 ? 'text-green-400' : 'text-red-400'}`}>
                  ${potentialWin}
                </span>
              </div>
            </div>

            {/* Connect wallet / Place bet */}
            <button
              onClick={executeBet}
              className={`w-full py-4 rounded-full font-bold text-lg transition-all ${
                selectedOutcome === 0 
                  ? 'bg-green-500 hover:bg-green-400 text-black' 
                  : 'bg-red-500 hover:bg-red-400 text-white'
              }`}
            >
              Connect Wallet
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
