import { queryBuilder } from '../../helpers/url';

export class BinanceMarket implements Market {
  private readonly baseUrl = 'https://api.binance.com/api/v3';

  async symbols(params?: { query?: string }): Promise<Symbol[]> {
    const { symbols } = (await this.exchangeInfo()) as { symbols: Symbol[] };

    return symbols.filter(({ symbol }) =>
      params?.query ? symbol.includes(params?.query.toUpperCase()) : true
    );
  }

  async exchangeInfo(): Promise<any> {
    const response = await fetch(`${this.baseUrl}/exchangeInfo`);
    const data = await response.json();
    return data;
  }

  async klines(options: {
    symbol: string;
    interval: string;
    startTime?: number;
    endTime?: number;
  }): Promise<Kline[]> {
    const response = await fetch(
      `${this.baseUrl}/klines?${queryBuilder({
        symbol: options.symbol,
        interval: options.interval,
        startTime: options?.startTime,
        endTime: options?.endTime,
      })}`
    );
    const data = await response.json();

    if (data.code) throw new Error(data.msg);

    return BinanceMarket.responseToKlines(data);
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
