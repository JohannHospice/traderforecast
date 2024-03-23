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

type IntervalKeys = '1h' | '4h' | '1d' | '1w' | '2w';
