import { NextResponse } from 'next/server';

const GAMMA_API = 'https://gamma-api.polymarket.com';

export async function GET() {
  try {
    // Fetch active markets from Polymarket's Gamma API
    const res = await fetch(`${GAMMA_API}/markets?closed=false&limit=50&order=volume&ascending=false`, {
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 60 } // Cache for 60 seconds
    });

    if (!res.ok) {
      throw new Error(`API responded with ${res.status}`);
    }

    const data = await res.json();
    
    // Transform the data to our format
    const markets = data.map((market: any) => ({
      id: market.id || market.condition_id,
      question: market.question,
      description: market.description,
      outcomes: market.outcomes || ['Yes', 'No'],
      outcomePrices: market.outcomePrices || [
        market.bestAsk?.toString() || '0.5',
        (1 - parseFloat(market.bestAsk || '0.5')).toString()
      ],
      volume: market.volume || market.volumeNum?.toString() || '0',
      liquidity: market.liquidity || market.liquidityNum?.toString() || '0',
      endDate: market.endDate || market.end_date_iso,
      category: market.category || extractCategory(market.tags),
      image: market.image,
      slug: market.slug
    }));

    return NextResponse.json({ markets });
  } catch (error) {
    console.error('Error fetching markets:', error);
    
    // Return mock data if API fails
    return NextResponse.json({ 
      markets: getMockMarkets() 
    });
  }
}

function extractCategory(tags: any[]): string | undefined {
  if (!tags || !Array.isArray(tags)) return undefined;
  const categoryTag = tags.find(t => typeof t === 'string') || tags[0]?.label;
  return categoryTag;
}

function getMockMarkets() {
  return [
    {
      id: '1',
      question: 'Will Bitcoin reach $150,000 by end of 2026?',
      outcomes: ['Yes', 'No'],
      outcomePrices: ['0.42', '0.58'],
      volume: '12500000',
      liquidity: '850000',
      endDate: '2026-12-31T23:59:59Z',
      category: 'Crypto'
    },
    {
      id: '2',
      question: 'Will Ethereum flip Bitcoin market cap in 2026?',
      outcomes: ['Yes', 'No'],
      outcomePrices: ['0.08', '0.92'],
      volume: '3200000',
      liquidity: '420000',
      endDate: '2026-12-31T23:59:59Z',
      category: 'Crypto'
    },
    {
      id: '3',
      question: 'Will the Fed cut rates in March 2026?',
      outcomes: ['Yes', 'No'],
      outcomePrices: ['0.65', '0.35'],
      volume: '8900000',
      liquidity: '1200000',
      endDate: '2026-03-20T18:00:00Z',
      category: 'Economics'
    },
    {
      id: '4',
      question: 'Will OpenAI release GPT-5 before July 2026?',
      outcomes: ['Yes', 'No'],
      outcomePrices: ['0.73', '0.27'],
      volume: '5600000',
      liquidity: '780000',
      endDate: '2026-07-01T00:00:00Z',
      category: 'Tech'
    },
    {
      id: '5',
      question: 'Will Taylor Swift announce new album in 2026?',
      outcomes: ['Yes', 'No'],
      outcomePrices: ['0.88', '0.12'],
      volume: '2100000',
      liquidity: '340000',
      endDate: '2026-12-31T23:59:59Z',
      category: 'Entertainment'
    }
  ];
}
