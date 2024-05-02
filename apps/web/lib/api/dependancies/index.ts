import { MarketRepository } from './market/repositories';
import { SantimentMarketRepository } from './market/repositories/santiment-market-repository';
import { CachedMarketRepository } from './market/repositories/cached-market-repository';
import { appoloSantiment } from './market/clients/appolo-santiment';

export default {
  cachedMarket: new CachedMarketRepository(
    new SantimentMarketRepository(appoloSantiment)
  ),
  market: new SantimentMarketRepository(appoloSantiment),
} satisfies {
  cachedMarket: MarketRepository;
  market: MarketRepository;
};
