interface Market {
  klines(params: {
    slug: string;
    interval: string;
    startTime?: number | string;
    endTime?: number;
  }): Promise<{ symbol: Symbol; klines: Kline[] }>;

  symbols(params?: { query?: string }): Promise<Symbol[]>;
}

interface Kline {
  openTime: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  closeTime: number;
  quoteAssetVolume: string;
  numberOfTrades: number;
  takerBuyBaseAssetVolume: string;
  takerBuyQuoteAssetVolume: string;
}

interface Symbol {
  slug: string;
  name: string;
  ticker?: string;
  logoUrl?: string;
  price_usd?: string;
  price_usd_change_1d?: string;
  volume_usd?: string;
  volume_usd_change_1d?: string;
  marketcap_usd?: string;
  rank?: string;
  dev_activity_1d?: string;
  daily_active_addresses?: string;
  market_segments?: string;
}
