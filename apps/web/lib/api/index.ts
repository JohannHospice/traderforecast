import { BinanceMarket } from './market/binance-market';

export default {
  market: new BinanceMarket(),
} as {
  market: Market;
};
