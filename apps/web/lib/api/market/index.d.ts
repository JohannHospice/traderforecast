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
