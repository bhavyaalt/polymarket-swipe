'use client';

import { Market } from '@/types/market';
import { useState } from 'react';

interface MarketCardProps {
  market: Market;
  isActive: boolean;
}

export default function MarketCard({ market, isActive }: MarketCardProps) {
  const [selectedOutcome, setSelectedOutcome] = useState<number | null>(null);
  const [betAmount, setBetAmount] = useState<number>(5);
  const [showBetModal, setShowBetModal] = useState(false);

  const yesPrice = parseFloat(market.outcomePrices[0] || '0.5');
  const noPrice = parseFloat(market.outcomePrices[1] || '0.5');
  const yesPercent = Math.round(yesPrice * 100);
  const noPercent = Math.round(noPrice * 100);

  const formatVolume = (vol: string) => {
    const num = parseFloat(vol);
    if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `$${(num / 1000).toFixed(1)}K`;
    return `$${num.toFixed(0)}`;
  };

  const handleBet = (outcome: number) => {
    setSelectedOutcome(outcome);
    setShowBetModal(true);
  };

  const executeBet = () => {
    // TODO: Integrate with wallet
    alert(`Would bet $${betAmount} on ${selectedOutcome === 0 ? 'YES' : 'NO'}\n\nWallet integration coming soon!`);
    setShowBetModal(false);
  };

  const potentialWin = selectedOutcome !== null 
    ? (betAmount / (selectedOutcome === 0 ? yesPrice : noPrice)).toFixed(2)
    : '0';

  return (
    <div className="h-full w-full bg-gradient-to-b from-gray-900 to-black flex flex-col justify-between p-6 relative">
      {/* Category tag */}
      {market.category && (
        <div className="absolute top-6 left-6">
          <span className="bg-purple-600/80 text-white text-xs px-3 py-1 rounded-full uppercase tracking-wide">
            {market.category}
          </span>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col justify-center max-w-lg mx-auto w-full">
        {/* Question */}
        <h1 className="text-white text-2xl md:text-3xl font-bold text-center mb-8 leading-tight">
          {market.question}
        </h1>

        {/* Price bars */}
        <div className="space-y-4 mb-8">
          {/* YES bar */}
          <div className="relative">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-green-400 font-semibold">YES</span>
              <span className="text-green-400 font-bold">{yesPercent}¢</span>
            </div>
            <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all duration-500"
                style={{ width: `${yesPercent}%` }}
              />
            </div>
          </div>

          {/* NO bar */}
          <div className="relative">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-red-400 font-semibold">NO</span>
              <span className="text-red-400 font-bold">{noPercent}¢</span>
            </div>
            <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-red-500 to-red-400 rounded-full transition-all duration-500"
                style={{ width: `${noPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Bet buttons */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => handleBet(0)}
            className="flex-1 bg-green-500 hover:bg-green-400 text-black font-bold py-4 px-6 rounded-2xl transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-green-500/30"
          >
            BUY YES
          </button>
          <button
            onClick={() => handleBet(1)}
            className="flex-1 bg-red-500 hover:bg-red-400 text-white font-bold py-4 px-6 rounded-2xl transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-red-500/30"
          >
            BUY NO
          </button>
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-6 text-gray-400 text-sm">
          <div className="text-center">
            <p className="text-white font-semibold">{formatVolume(market.volume)}</p>
            <p>Volume</p>
          </div>
          <div className="text-center">
            <p className="text-white font-semibold">{formatVolume(market.liquidity)}</p>
            <p>Liquidity</p>
          </div>
          {market.endDate && (
            <div className="text-center">
              <p className="text-white font-semibold">
                {new Date(market.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </p>
              <p>Ends</p>
            </div>
          )}
        </div>
      </div>

      {/* Swipe indicator */}
      <div className="flex flex-col items-center text-gray-500 animate-bounce">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
        <span className="text-xs">Swipe for more</span>
      </div>

      {/* Bet Modal */}
      {showBetModal && (
        <div className="fixed inset-0 bg-black/80 flex items-end justify-center z-50" onClick={() => setShowBetModal(false)}>
          <div 
            className="bg-gray-900 w-full max-w-lg rounded-t-3xl p-6 pb-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-1 bg-gray-700 rounded-full mx-auto mb-6" />
            
            <h3 className="text-white text-xl font-bold mb-4 text-center">
              Buy {selectedOutcome === 0 ? 'YES' : 'NO'} @ {selectedOutcome === 0 ? yesPercent : noPercent}¢
            </h3>

            {/* Amount selector */}
            <div className="flex gap-2 mb-4">
              {[1, 5, 10, 25, 100].map((amount) => (
                <button
                  key={amount}
                  onClick={() => setBetAmount(amount)}
                  className={`flex-1 py-2 rounded-lg font-semibold transition-all ${
                    betAmount === amount 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  ${amount}
                </button>
              ))}
            </div>

            {/* Potential return */}
            <div className="bg-gray-800 rounded-xl p-4 mb-6">
              <div className="flex justify-between text-gray-400 mb-2">
                <span>You pay</span>
                <span className="text-white">${betAmount} USDC</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Potential return</span>
                <span className="text-green-400 font-bold">${potentialWin}</span>
              </div>
            </div>

            {/* Connect wallet / Place bet */}
            <button
              onClick={executeBet}
              className={`w-full py-4 rounded-2xl font-bold text-lg transition-all ${
                selectedOutcome === 0 
                  ? 'bg-green-500 hover:bg-green-400 text-black' 
                  : 'bg-red-500 hover:bg-red-400 text-white'
              }`}
            >
              Connect Wallet to Bet
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
