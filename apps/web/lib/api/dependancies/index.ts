import { MarketRepository } from './market/repositories';
import { SantimentMarketRepository } from './market/repositories/santiment-market-repository';
import { appoloSantiment } from './market/clients/appolo-santiment';
import { LocalMarketRepository } from './market/repositories/local-market-repository';

// const cachedMarket = new CachedMarketRepository(
//   new SantimentMarketRepository(appoloSantiment)
// );

export default {
  market: process.env.OFFLINE
    ? new LocalMarketRepository()
    : new SantimentMarketRepository(appoloSantiment),
} satisfies {
  market: MarketRepository;
};
