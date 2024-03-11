import { queryBuilder } from '../helpers/url';

export class Binance implements MarketApi {
  private readonly baseUrl = 'https://api.binance.com/api/v3';

  async klines(
    symbol: string,
    interval: string,
    options?: {
      startTime?: number;
      endTime?: number;
    }
  ): Promise<Kline[]> {
    const response = await fetch(
      `${this.baseUrl}/klines?${queryBuilder({
        symbol,
        interval,
        startTime: options?.startTime,
        endTime: options?.endTime,
      })}`
    );

    const data = await response.json();

    return Binance.responseToKlines(data);
  }
  async symbols(): Promise<Symbol[]> {
    const info = await this.exchangeInfo();
    return info.symbols;
  }

  async exchangeInfo(): Promise<any> {
    const response = await fetch(`${this.baseUrl}/exchangeInfo`);
    const data = await response.json();
    return data;
  }

  private static responseToKlines(
    responseData: BinanceKlineResponse[]
  ): Kline[] {
    return responseData.map((data: BinanceKlineResponse) => ({
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
    }));
  }
}

type BinanceKlineResponse = [
  number,
  string,
  string,
  string,
  string,
  string,
  number,
  string,
  number,
  string,
  string,
];
