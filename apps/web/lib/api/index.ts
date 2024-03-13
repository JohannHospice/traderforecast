import { ApolloClient, InMemoryCache } from '@apollo/client';
import { SantimentMarket } from './market/santiment-market';
import { RealtimeMarket } from './realtime-market';
import { ApiRealtimeMarket } from './realtime-market/api-realtime-market';

export default {
  market: new SantimentMarket(
    new ApolloClient({
      uri: 'https://api.santiment.net/graphiql',
      cache: new InMemoryCache(),
    })
  ),
  realtimeMarket: new ApiRealtimeMarket(),
} as {
  market: Market;
  realtimeMarket: RealtimeMarket;
};
