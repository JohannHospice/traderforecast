interface Market {
  intervals: IntervalKeys[];

  klines(params: {
    slug: string;
    interval: IntervalKeys;
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

  lastKline(params: { slug: string; interval: IntervalKeys }): Promise<Kline>;
}
