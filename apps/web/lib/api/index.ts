import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
  from,
} from '@apollo/client';
import { SantimentMarketRepository } from './repositories/market/santiment-market';
import { RealtimeMarket } from './repositories/realtime-market';
import { ApiRealtimeMarket } from './repositories/realtime-market/api-realtime-market';
import { loadErrorMessages, loadDevMessages } from '@apollo/client/dev';
import { MarketRepository } from './repositories/market';

if (process.env.NODE_ENV !== 'production') {
  // Adds messages only in a dev environment
  loadDevMessages();
  loadErrorMessages();
}

export default {
  market: new SantimentMarketRepository(
    new ApolloClient({
      // cache data during 5 minutes
      ssrMode: typeof window === 'undefined',
      cache: new InMemoryCache(),
      link: from([
        // Log queries
        new ApolloLink((operation, forward) => {
          console.log(
            `QUERY[santiment/${operation.operationName}]:`,
            operation.variables
          );
          return forward(operation);
        }),
        new HttpLink({
          uri: 'https://api.santiment.net/graphiql',
        }),
      ]),
    })
  ),
  realtimeMarket: new ApiRealtimeMarket(),
} as {
  market: MarketRepository;
  realtimeMarket: RealtimeMarket;
};
