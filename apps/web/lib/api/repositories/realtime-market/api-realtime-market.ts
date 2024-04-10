import { RealtimeMarket } from '.';
import { GetOHLCParams } from '../market';

export class ApiRealtimeMarket implements RealtimeMarket {
  async getLatestKline(
    slug: string,
    interval: IntervalKeys = '1d'
  ): Promise<Kline> {
    const query = new URLSearchParams();
    query.set('interval', interval);

    const res = await fetch(
      `/api/symbols/${slug}/lastKline?${query.toString()}`
    );

    return res.json();
  }

  async getOHLCs({
    slug,
    interval,
    startTime,
    endTime,
  }: GetOHLCParams): Promise<Kline[]> {
    const query = new URLSearchParams();
    query.set('interval', interval);
    query.set('startTime', String(startTime));
    query.set('endTime', String(endTime));

    const res = await fetch(`/api/symbols/${slug}/ohlc?${query.toString()}`);

    return res.json();
  }
}
