import { RealtimeMarket } from '.';

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
}
