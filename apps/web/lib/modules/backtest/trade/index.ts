import { OHLC } from '..';

export abstract class Trade {
  public ohlcClose?: OHLC;
  public status: TradeStatus = 'await';

  constructor(
    public entryPrice: number,
    public type: string,
    public entryTime?: number
  ) {
    if (!entryTime) this.status = 'open';
  }

  update(ohlc: OHLC): void {
    if (this.shouldOpen(ohlc)) {
      this.status = 'open';
    }

    if (!this.isStatus('open')) return;

    if (this.shouldSucceed(ohlc)) {
      this.status = 'success';
      this.ohlcClose = ohlc;
    }

    if (this.shouldFail(ohlc)) {
      this.status = 'fail';
      this.ohlcClose = ohlc;
    }
  }

  shouldOpen(ohlc: OHLC): boolean {
    return (
      this.isStatus('await') ||
      !this.entryTime ||
      !!(this.entryTime && ohlc.closeTime > this.entryTime)
    );
  }

  cancel(): void {
    this.status = 'canceled';
  }

  isActive(): boolean {
    return this.isStatus('open', 'await');
  }

  isClosed(): boolean {
    return this.isStatus('success', 'fail', 'canceled');
  }

  isStatus(...status: TradeStatus[]): boolean {
    return status.includes(this.status);
  }

  public abstract get profitLoss(): number;
  protected abstract shouldSucceed(ohlc: OHLC): boolean;
  protected abstract shouldFail(ohlc: OHLC): boolean;
}

export type TradeStatus = 'await' | 'open' | 'success' | 'fail' | 'canceled';
