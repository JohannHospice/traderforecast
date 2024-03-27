import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
  from,
} from '@apollo/client';
import { loadDevMessages, loadErrorMessages } from '@apollo/client/dev';
import { MarketRepository } from './repositories/market';
import { SantimentMarketRepository } from './repositories/market/santiment-market';
import { RealtimeMarket } from './repositories/realtime-market';
import { ApiRealtimeMarket } from './repositories/realtime-market/api-realtime-market';

if (process.env.NODE_ENV !== 'production') {
  loadDevMessages();
  loadErrorMessages();
}

const appoloClient = new ApolloClient({
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
});

export default {
  market: new SantimentMarketRepository(appoloClient),
  realtimeMarket: new ApiRealtimeMarket(),
} as {
  market: MarketRepository;
  realtimeMarket: RealtimeMarket;
};
