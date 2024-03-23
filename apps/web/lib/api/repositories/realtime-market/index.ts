export interface RealtimeMarket {
  hotKline(slug: string, interval: IntervalKeys): Promise<Kline>;
}
