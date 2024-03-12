import { ApolloClient, InMemoryCache } from '@apollo/client';
import { SantimentMarket } from './market/santiment-market';

export default {
  market: new SantimentMarket(
    new ApolloClient({
      uri: 'https://api.santiment.net/graphiql',
      cache: new InMemoryCache(),
    })
  ),
} as {
  market: Market;
};
