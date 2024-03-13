import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
  from,
} from '@apollo/client';
import { SantimentMarket } from './market/santiment-market';
import { RealtimeMarket } from './realtime-market';
import { ApiRealtimeMarket } from './realtime-market/api-realtime-market';

export default {
  market: new SantimentMarket(
    new ApolloClient({
      cache: new InMemoryCache(),
      link: from([
        // Log queries
        new ApolloLink((operation, forward) => {
          console.log('QUERY[santiment]:', operation.variables);
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
  market: Market;
  realtimeMarket: RealtimeMarket;
};
