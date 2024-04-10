export interface WalletClient {
  addTrade(trade: Trade): void;
  cancelTrade(trade: Trade): void;

  get activeTrades(): Trade[];
  get closedTrades(): Trade[];
  get balance(): number;
}

export interface Symbol {
  key: string;
  timeperiod: TimePeriod;
}

export interface OHLC {
  open: number;
  high: number;
  low: number;
  close: number;
  closeTime: number;
  openTime: number;
}

export type TimePeriod = '1m' | '5m' | '15m' | '1h' | '4h' | '1d' | '1w' | '1M';

export interface Timeframe {
  from: number;
  to: number;
}
