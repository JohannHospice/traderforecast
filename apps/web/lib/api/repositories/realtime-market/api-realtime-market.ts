import { SEARCH_PARAMS } from '@/lib/constants/navigation';
import { RealtimeMarket } from '.';
import { GetKlinesAndSymbolParams, GetOHLCParams } from '../market';

export class ApiRealtimeMarket implements RealtimeMarket {
  async getLatestKline(
    slug: string,
    interval: IntervalKeys = '1d'
  ): Promise<Kline> {
    const res = await fetch(
      `/api/symbols/${slug}/lastKline?${SEARCH_PARAMS.INTERVAL}=${interval}`
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
    query.set(SEARCH_PARAMS.INTERVAL, interval);
    query.set('startTime', String(startTime));
    query.set('endTime', String(endTime));

    const res = await fetch(`/api/symbols/${slug}/ohlc?${query.toString()}`);

    return res.json();
  }
}
