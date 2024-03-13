import { SEARCH_PARAMS } from '../../../app/constants/navigation';
import { RealtimeMarket } from '.';

export class ApiRealtimeMarket implements RealtimeMarket {
  async hotKline(slug: string, interval: string = '1d'): Promise<Kline> {
    const res = await fetch(
      `/api/symbols/${slug}/lastKline?${SEARCH_PARAMS.INTERVAL}=${interval}`
    );

    return res.json();
  }
}
