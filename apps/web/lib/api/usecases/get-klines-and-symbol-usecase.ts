import {
  GetKlinesAndSymbolParams,
  MarketRepository,
} from '../repositories/market';

export class GetKlinesAndSymbolUsecase {
  constructor(private market: MarketRepository) {}

  async execute({
    slug,
    interval,
    startTime,
  }: GetKlinesAndSymbolParams): Promise<{ symbol: Symbol; klines: Kline[] }> {
    return this.market.getKlinesAndSymbol({
      slug,
      interval,
      startTime,
    });
  }
}
