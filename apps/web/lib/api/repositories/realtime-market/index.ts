export interface RealtimeMarket {
  getLatestKline(slug: string, interval: IntervalKeys): Promise<Kline>;
}
