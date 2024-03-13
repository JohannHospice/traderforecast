export interface RealtimeMarket {
  hotKline(slug: string, interval: string): Promise<Kline>;
}
