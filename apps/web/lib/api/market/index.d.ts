interface Market {
  intervals: string[];

  klines(params: {
    slug: string;
    interval: string;
    startTime?: number | string;
    endTime?: number;
  }): Promise<{ symbol: Symbol; klines: Kline[] }>;

  symbols(params?: {
    query?: string;
    segments?: string[];
    page?: number;
    size?: number;
  }): Promise<{ symbols: Symbol[]; pages: number }>;

  marketSegments(): Promise<string[]>;

  lastKline(params: { slug: string; interval: string }): Promise<Kline>;
}

interface Kline {
  open: number;
  high: number;
  low: number;
  close: number;
  openTime: number;
  closeTime: number;
}

interface Symbol {
  slug: string;
  name: string;
  ticker?: string;
  logoUrl?: string;
  price_usd?: number;
  price_usd_change_1d?: number;
  volume_usd?: number;
  volume_usd_change_1d?: number;
  marketcap_usd?: number;
  rank?: number;
  dev_activity_1d?: number;
  daily_active_addresses?: number;
  market_segments?: string[];
}
