import { Trade } from '.';
import { OHLC } from '..';

export class ShortTrade extends Trade {
  constructor(
    entryPrice: number,
    public takeProfitPrice: number,
    public stopLossPrice?: number,
    entryTime?: number | undefined
  ) {
    super(entryPrice, entryTime);
  }

  shouldSucceed(ohlc: OHLC): boolean {
    return ohlc.low <= this.takeProfitPrice;
  }

  shouldFail(ohlc: OHLC): boolean {
    return !!this.stopLossPrice && ohlc.high >= this.stopLossPrice;
  }

  get profitLoss(): number {
    if (!this.ohlcClose) {
      return NaN;
    }
    if (this.isStatus('success')) {
      return this.entryPrice - this.takeProfitPrice;
    }
    if (this.isStatus('fail') && this.stopLossPrice) {
      return this.entryPrice - this.stopLossPrice;
    }
    return 0;
  }
}
