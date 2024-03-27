export interface MarketRepository {
  intervals: IntervalKeys[];

  getKlinesAndSymbol(
    params: GetKlinesAndSymbolParams
  ): Promise<{ symbol: Symbol; klines: Kline[] }>;

  getSymbols(
    params?: GetSymbolsParams
  ): Promise<{ symbols: Symbol[]; pages: number }>;

  getSymbol(slug: string): Promise<Symbol>;

  getMarketSegments(): Promise<string[]>;

  getLatestKline(params: GetLatestKlineParams): Promise<Kline>;
}

export interface GetKlinesAndSymbolParams {
  slug: string;
  interval: IntervalKeys;
  startTime?: number | string;
  endTime?: number;
}

export interface GetSymbolsParams {
  query?: string;
  segments?: string[];
  page?: number;
  size?: number;
}

export interface GetLatestKlineParams {
  slug: string;
  interval: IntervalKeys;
}
