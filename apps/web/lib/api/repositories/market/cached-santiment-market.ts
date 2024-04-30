import { getOHLCs, saveOHLCs } from '@traderforecast/caching';
import { GetOHLCParams } from '.';
import { SantimentMarketRepository } from './santiment-market';

export class CachedSantimentMarketRepository<
  T,
> extends SantimentMarketRepository<T> {
  static readonly OHLC_CACHE_BASE = 'ohlc_data';
  static readonly OHLC_ORIGIN = 'santiment';

  async getOHLCs(params: GetOHLCParams): Promise<Kline[]> {
    const { interval, slug: symbol, endTime, startTime } = params;

    console.log('Getting OHLCs from cache');

    const ohlcs = await getOHLCs(
      CachedSantimentMarketRepository.OHLC_CACHE_BASE,
      {
        interval,
        symbol,
        endTime,
        startTime,
        origin: CachedSantimentMarketRepository.OHLC_ORIGIN,
      }
    );

    if (ohlcs.length > 0) {
      console.log('OHLCs found in cache');

      return ohlcs;
    }
    console.log('OHLCs not found in cache');

    const klines = await super.getOHLCs(params);

    console.log('Saving OHLCs to cache');

    await saveOHLCs(
      CachedSantimentMarketRepository.OHLC_CACHE_BASE,
      klines.map((kline) => ({
        ...kline,
        origin: CachedSantimentMarketRepository.OHLC_ORIGIN,
        symbol,
        interval,
      }))
    );

    console.log('OHLCs saved to cache');

    return klines;
  }
}
