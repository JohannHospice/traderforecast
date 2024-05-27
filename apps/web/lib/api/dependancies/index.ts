import { MarketRepository } from './market/repositories';
import { SantimentMarketRepository } from './market/repositories/santiment-market-repository';
import { CachedMarketRepository } from './market/repositories/cached-market-repository';
import { appoloSantiment } from './market/clients/appolo-santiment';
import { LocalMarketRepository } from './market/repositories/local-market-repository';

export default {
  cachedMarket: new CachedMarketRepository(
    new SantimentMarketRepository(appoloSantiment)
  ),
  market: new LocalMarketRepository(),
} satisfies {
  cachedMarket: MarketRepository;
  market: MarketRepository;
};
