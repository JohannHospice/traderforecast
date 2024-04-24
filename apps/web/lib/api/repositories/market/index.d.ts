export interface MarketRepository {
  intervals: IntervalKeys[];

  getOHLCs(params: GetOHLCParams): Promise<Kline[]>;

  getKlinesAndSymbol(
    params: GetKlinesAndSymbolParams
  ): Promise<{ symbol: Symbol; klines: Kline[] }>;

  getAllSymbols(): Promise<GetAllSymbolResponse>;

  getSymbolsBySlugs(slugs: string[]): Promise<Symbol[]>;

  getMarketSegments(): Promise<string[]>;

  getLatestKline(params: GetLatestKlineParams): Promise<Kline>;

  getSortedSymbols(): Promise<Symbol[]>;
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
  interval: IntervalKeys;
}

export type GetAllSymbolResponse = {
  slug: string;
  marketSegments: string[];
  rank: number | null;
  ticker: string;
}[];
