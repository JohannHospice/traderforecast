import { Symbol } from '../models/symbol';
import { GetKlinesAndSymbolParams, MarketRepository } from '../repositories';

export class GetKlinesAndSymbolUsecase {
  constructor(private market: MarketRepository) {}

  async execute({
    slug,
    interval,
    startTime,
  }: GetKlinesAndSymbolParams): Promise<{
    symbol: Symbol;
    klines: Kline[];
    intervals: string[];
  }> {
    return {
      ...(await this.market.getOhlcsAndSymbol({
        slug,
        interval,
        startTime,
      })),
      intervals: this.market.intervals,
    };
  }
}
