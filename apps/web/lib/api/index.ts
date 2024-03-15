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
import { loadErrorMessages, loadDevMessages } from '@apollo/client/dev';

if (process.env.NODE_ENV !== 'production') {
  // Adds messages only in a dev environment
  loadDevMessages();
  loadErrorMessages();
}
export default {
  market: new SantimentMarket(
    new ApolloClient({
      // cache data during 5 minutes
      ssrMode: typeof window === 'undefined',
      cache: new InMemoryCache(),
      link: from([
        // forward cache if last query where less than 5 minutes ago
        new ApolloLink((operation, forward) => {
          const { cache } = operation.getContext();
          const cached = cache.extract();
          if (cached) {
            const query = operation.query.loc?.source.body;
            if (query) {
              const key = JSON.stringify({
                query,
                variables: operation.variables,
              });
              if (cached[key]) {
                const diff = Date.now() - cached[key].timestamp;
                if (diff < 5 * 1000) {
                  return cached[key].result;
                }
              }
            }
          }
          return forward(operation);
        }),
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
