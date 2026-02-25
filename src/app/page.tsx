'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import MarketCard from '@/components/MarketCard';
import { Market } from '@/types/market';

export default function Home() {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMarkets();
  }, []);

  const fetchMarkets = async () => {
    try {
      const res = await fetch('/api/markets');
      const data = await res.json();
      setMarkets(data.markets || []);
    } catch (error) {
      console.error('Failed to fetch markets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    const scrollTop = containerRef.current.scrollTop;
    const cardHeight = window.innerHeight;
    const newIndex = Math.round(scrollTop / cardHeight);
    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex);
    }
  }, [currentIndex]);

  if (loading) {
    return (
      <div className="h-screen w-full bg-black flex items-center justify-center">
        <div className="text-white text-xl animate-pulse">Loading markets...</div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="h-screen w-full overflow-y-scroll snap-y snap-mandatory bg-black"
    >
      {markets.map((market, index) => (
        <div key={market.id} className="h-screen w-full snap-start snap-always">
          <MarketCard market={market} isActive={index === currentIndex} />
        </div>
      ))}
      
      {markets.length === 0 && (
        <div className="h-screen w-full flex items-center justify-center">
          <p className="text-white text-xl">No markets found</p>
        </div>
      )}
    </div>
  );
}
