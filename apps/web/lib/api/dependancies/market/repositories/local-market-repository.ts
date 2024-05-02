import { GetAllSymbolResponse, GetOHLCParams, MarketRepository } from '.';
import { Symbol } from '../models/symbol';
import data from '../.data/bitcoin_ohlc_utc-265d_15m.json';

export class LocalMarketRepository implements MarketRepository {
  constructor() {}

  intervals: IntervalKeys[] = ['15m'];

  async getLatestKline(params: {
    slug: string;
    interval: string;
  }): Promise<Kline> {
    return data[data.length - 1];
  }

  async getOHLCs({
    slug,
    interval,
    startTime,
    endTime,
  }: GetOHLCParams): Promise<Kline[]> {
    return data.filter(
      ({ closeTime }) =>
        (startTime ? startTime <= closeTime : true) &&
        (endTime ? closeTime <= endTime : true)
    );
  }

  async getKlinesAndSymbol({
    slug,
    interval = '1d',
    startTime = 'utc_now-7d',
    endTime = 'utc_now',
  }: {
    slug: string;
    interval?: IntervalKeys;
    startTime?: number | string;
    endTime?: number | string;
  }): Promise<{ symbol: Symbol; klines: Kline[] }> {
    return {
      symbol: {
        slug: 'bitcoin',
        name: 'bitcoin',
      },
      klines: await this.getOHLCs({
        startTime: new Date(startTime).getTime(),
        endTime: new Date(endTime).getTime(),
        interval,
        slug,
      }),
    };
  }

  async getAllSymbols(): Promise<GetAllSymbolResponse> {
    return [
      {
        slug: 'bitcoin',
        marketSegments: [],
        rank: null,
        ticker: 'bitcoin',
      },
    ];
  }

  async getSymbolsBySlugs(slugs: string[]): Promise<Symbol[]> {
    return [
      {
        slug: 'bitcoin',
        name: 'bitcoin',
      },
    ];
  }

  async getMarketSegments(): Promise<string[]> {
    return [];
  }

  async getSortedSymbols(): Promise<Symbol[]> {
    return [
      {
        slug: 'bitcoin',
        name: 'bitcoin',
      },
    ];
  }
}
