import { Trade } from '.';
import { OHLC } from '..';

export class LongTrade extends Trade {
  constructor(
    entryPrice: number,
    public takeProfitPrice: number,
    public stopLossPrice?: number,
    entryTime?: number | undefined
  ) {
    super(entryPrice, entryTime);
  }

  shouldSucceed(ohlc: OHLC): boolean {
    return ohlc.high >= this.takeProfitPrice;
  }

  shouldFail(ohlc: OHLC): boolean {
    return !!this.stopLossPrice && ohlc.low <= this.stopLossPrice;
  }

  get profitLoss(): number {
    if (this.isStatus('success')) {
      return this.takeProfitPrice - this.entryPrice;
    }
    if (this.isStatus('fail') && this.stopLossPrice) {
      return this.stopLossPrice - this.entryPrice;
    }
    return 0;
  }
}
