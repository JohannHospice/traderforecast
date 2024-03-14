import { Indicator } from '../indicator';

export interface Candlestick {
  setData(klines: Kline[]): void;
  applyIndices(indices: Indicator[]): void;
  update(klines: Kline[]): void;
}
