import { BinanceMarketApi } from './market-api/binance-market-api';

export default {
  market: new BinanceMarketApi(),
} as {
  market: MarketApi;
};
