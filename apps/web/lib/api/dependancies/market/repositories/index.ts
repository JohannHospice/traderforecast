import { Symbol } from '../models/symbol';
import { IntervalKeys } from '../models/interval-keys';
import { Ohlc } from '../models/ohlc';

export interface MarketRepository {
  intervals: IntervalKeys[];

  getOHLCs(params: GetOHLCParams): Promise<Ohlc[]>;

  getOhlcsAndSymbol(
    params: GetKlinesAndSymbolParams
  ): Promise<{ symbol: Symbol; klines: Ohlc[] }>;

  getAllSymbols(): Promise<GetAllSymbolResponse>;

  getSymbolsBySlugs(slugs: string[]): Promise<Symbol[]>;

  getMarketSegments(): Promise<string[]>;

  getLatestKline(params: GetLatestKlineParams): Promise<Ohlc>;

  getSymbolsSorted(): Promise<Symbol[]>;
}

export interface GetKlinesAndSymbolParams {
  slug: string;
  interval: IntervalKeys;
  startTime?: number | string;
  endTime?: number;
}
export interface GetOHLCParams {
  slug: string;
  interval: string;
  startTime?: number;
  endTime?: number;
}

export interface GetLatestKlineParams {
  slug: string;
  interval: IntervalKeys | string;
}

export type GetAllSymbolResponse = {
  slug: string;
  marketSegments: string[];
  rank: number | null;
  ticker: string;
}[];
