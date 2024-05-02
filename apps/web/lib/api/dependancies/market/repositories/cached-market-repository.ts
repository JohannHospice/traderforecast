import { getOHLCs, saveOHLCs } from '@traderforecast/caching';
import {
  GetAllSymbolResponse,
  GetKlinesAndSymbolParams,
  GetLatestKlineParams,
  GetOHLCParams,
  MarketRepository,
} from '.';
import { Symbol } from '../models/symbol';

export class CachedMarketRepository implements MarketRepository {
  static readonly OHLC_CACHE_BASE = 'ohlc_data';
  static readonly OHLC_ORIGIN = 'santiment';

  constructor(private market: MarketRepository) {}

  get intervals(): IntervalKeys[] {
    return this.market.intervals;
  }

  async getOHLCs(params: GetOHLCParams): Promise<Kline[]> {
    const { interval, slug: symbol, endTime, startTime } = params;

    console.log('Getting OHLCs from cache');

    const ohlcs = await getOHLCs(CachedMarketRepository.OHLC_CACHE_BASE, {
      interval,
      symbol,
      endTime,
      startTime,
      origin: CachedMarketRepository.OHLC_ORIGIN,
    });

    if (ohlcs.length > 0) {
      console.log('OHLCs found in cache');

      return ohlcs;
    }
    console.log('OHLCs not found in cache');

    const klines = await this.market.getOHLCs(params);

    console.log('Saving OHLCs to cache');

    await saveOHLCs(
      CachedMarketRepository.OHLC_CACHE_BASE,
      klines.map((kline) => ({
        ...kline,
        origin: CachedMarketRepository.OHLC_ORIGIN,
        symbol,
        interval,
      }))
    );

    console.log('OHLCs saved to cache');

    return klines;
  }

  async getLatestKline(params: GetLatestKlineParams): Promise<Kline> {
    return this.market.getLatestKline(params);
  }

  async getKlinesAndSymbol(
    params: GetKlinesAndSymbolParams
  ): Promise<{ symbol: Symbol; klines: Kline[] }> {
    return this.market.getKlinesAndSymbol(params);
  }

  async getAllSymbols(): Promise<GetAllSymbolResponse> {
    return this.market.getAllSymbols();
  }

  async getSymbolsBySlugs(slugs: string[]): Promise<Symbol[]> {
    return this.market.getSymbolsBySlugs(slugs);
  }

  async getMarketSegments(): Promise<string[]> {
    return this.market.getMarketSegments();
  }

  async getSortedSymbols(): Promise<Symbol[]> {
    return this.market.getSortedSymbols();
  }
}
