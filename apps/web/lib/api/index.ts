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
import { CachedSantimentMarketRepository } from './repositories/market/cached-santiment-market';

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
  cachedMarket: new CachedSantimentMarketRepository(appoloClient),
  market: new SantimentMarketRepository(appoloClient),
} as {
  cachedMarket: MarketRepository;
  market: MarketRepository;
};
