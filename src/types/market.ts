export interface Market {
  id: string;
  question: string;
  description?: string;
  outcomes: string[];
  outcomePrices: string[];
  volume: string;
  liquidity: string;
  endDate?: string;
  category?: string;
  image?: string;
  slug?: string;
}
