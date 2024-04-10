import { GetOHLCParams } from '../market';

export interface RealtimeMarket {
  getLatestKline(slug: string, interval: IntervalKeys): Promise<Kline>;
  getOHLCs(params: GetOHLCParams): Promise<Kline[]>;
}
