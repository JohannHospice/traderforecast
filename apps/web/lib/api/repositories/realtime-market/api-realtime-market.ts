import { SEARCH_PARAMS } from '@/lib/constants/navigation';
import { RealtimeMarket } from '.';

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
}
