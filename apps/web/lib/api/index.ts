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
    // add the authorization to the headers
    new ApolloLink((operation, forward) => {
      operation.setContext({
        headers: {
          Authorization: `Apikey ${process.env.SANTIMENT_API_KEY}`,
        },
      });
      return forward(operation);
    }),
    // Log queries
    new ApolloLink((operation, forward) => {
      console.log(
        `QUERY[santiment/${operation.operationName}]: HIDE_VARIABLES`
        // operation.variables
      );
      return forward(operation);
    }),
    new HttpLink({
      uri: 'https://api.santiment.net/graphiql',
      fetch: async (uri, options) =>
        fetch(uri, options)
          .then((response) => {
            if (response.status !== 200) {
              console.error(
                response.status,
                response.statusText,
                response.headers
              );
            }
            // log headers
            console.log('HEADERS:', response.headers);
            return response;
          })
          .catch((error) => Promise.reject(error)),
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
