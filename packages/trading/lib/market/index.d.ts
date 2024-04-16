import { Timeframe, OHLC, Symbol } from '..';

export interface Market {
  getOHLCs(timeframe: Timeframe): Promise<OHLC[]>;
  getOHLC(time: number): Promise<OHLC>;
}

export interface MarketHandler {
  getMarket(symbol: Symbol): Market;
}
