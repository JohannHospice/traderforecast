import { queryBuilder } from '../../helpers/url';

/**
 * @deprecated
 */
export class BinanceMarket implements Market {
  intervals: string[] = [];
  lastKline(params: { slug: string; interval: string }): Promise<Kline> {
    throw new Error('Method not implemented.');
  }
  isRealTimeEnabled(): boolean {
    throw new Error('Method not implemented.');
  }
  private readonly baseUrl = 'https://api.binance.com/api/v3';

  async symbols(params?: { query?: string }): Promise<Symbol[]> {
    const { symbols } = await this.exchangeInfo();

    return symbols
      .filter(({ symbol }: any) =>
        params?.query ? symbol.includes(params?.query.toUpperCase()) : true
      )
      .map((symbol: any) => ({
        slug: symbol.symbol,
        name: symbol.symbol,
      })) as Symbol[];
  }

  async exchangeInfo(): Promise<any> {
    const response = await fetch(`${this.baseUrl}/exchangeInfo`);
    const data = await response.json();
    return data;
  }

  async klines(options: {
    slug: string;
    interval: string;
    startTime?: number;
    endTime?: number;
  }): Promise<{ symbol: Symbol; klines: Kline[] }> {
    const response = await fetch(
      `${this.baseUrl}/klines?${queryBuilder({
        symbol: options.slug,
        interval: options.interval,
        startTime: options?.startTime,
        endTime: options?.endTime,
      })}`
    );
    const data = await response.json();

    if (data.code) throw new Error(data.msg);

    return {
      // @ts-ignore
      symbol: {
        slug: options.slug,
        name: options.slug,
      },
      klines: BinanceMarket.responseToKlines(data),
    };
  }

  private static responseToKlines(responseData: any): Kline[] {
    return responseData.map((data: any) => {
      return {
        openTime: data[0],
        open: data[1],
        high: data[2],
        low: data[3],
        close: data[4],
        volume: data[5],
        closeTime: data[6],
        quoteAssetVolume: data[7],
        numberOfTrades: data[8],
        takerBuyBaseAssetVolume: data[9],
        takerBuyQuoteAssetVolume: data[10],
      };
    });
  }
}
