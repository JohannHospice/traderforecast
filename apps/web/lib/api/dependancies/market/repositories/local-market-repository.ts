import { GetAllSymbolResponse, GetOHLCParams, MarketRepository } from '.';
import { Symbol } from '../models/symbol';
import data from '../.data/bitcoin_ohlc_utc-265d_15m.json';

const market = {
  bitcoin: {
    symbol: {
      slug: 'bitcoin',
      name: 'bitcoin',
    },
    ohlc: {
      '15m': data,
    },
  },
} as {
  [key: string]: {
    symbol: Symbol;
    ohlc: {
      [key: string]: Kline[];
    };
  };
};

export class LocalMarketRepository implements MarketRepository {
  constructor() {}

  intervals: IntervalKeys[] = ['15m'];

  async getLatestKline(params: {
    slug: string;
    interval: string;
  }): Promise<Kline> {
    console.log({ params });
    throw new Error('Method not implemented.');

    const ohlcs = market[params.slug].ohlc[params.interval];
    return ohlcs[ohlcs.length - 1];
  }

  async getOHLCs({
    slug,
    interval,
    startTime,
    endTime,
  }: GetOHLCParams): Promise<Kline[]> {
    return market[slug].ohlc[interval].filter(
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
      symbol: market[slug].symbol,
      klines: await this.getOHLCs({
        startTime: new Date(startTime).getTime(),
        endTime: new Date(endTime).getTime(),
        interval,
        slug,
      }),
    };
  }

  async getAllSymbols(): Promise<GetAllSymbolResponse> {
    return Object.keys(market).map((key) => ({
      ...market[key].symbol,
      marketSegments: [],
      rank: null,
      ticker: key,
    }));
  }

  async getSymbolsBySlugs(slugs: string[]): Promise<Symbol[]> {
    return Object.keys(market)
      .filter((key) => slugs.includes(key))
      .map((key) => market[key].symbol);
  }

  async getMarketSegments(): Promise<string[]> {
    return [];
  }

  async getSortedSymbols(): Promise<Symbol[]> {
    return Object.keys(market).map((key) => market[key].symbol);
  }
}
