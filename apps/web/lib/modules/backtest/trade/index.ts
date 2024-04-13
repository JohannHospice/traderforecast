import { OHLC } from '..';

export class Trade {
  public ohlcClose?: OHLC;
  public status: TradeStatus = 'open';
  constructor(
    public config: {
      entryPrice: number;
      takeProfit: number;
      stopLoss: number;
      entryTime: number;
    }
  ) {}

  update(ohlc: OHLC): void {
    if (!this.isStatus('open')) return;

    if (this.hitTakeProfit(ohlc)) {
      this.status = 'success';
      this.ohlcClose = ohlc;
    }

    if (this.hitStopLoss(ohlc)) {
      this.status = 'fail';
      this.ohlcClose = ohlc;
    }
  }

  cancel(): void {
    if (!this.isStatus('await')) {
      throw new Error('Trade can only be canceled if it is awaiting');
    }
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

  public get type(): 'long' | 'short' {
    return this.config.entryPrice > this.config.takeProfit ? 'short' : 'long';
  }

  public hitTakeProfit(ohlc: OHLC): boolean {
    if (this.type === 'long') {
      return ohlc.high >= this.config.takeProfit;
    }
    return ohlc.low <= this.config.takeProfit;
  }
  public hitStopLoss(ohlc: OHLC): boolean {
    if (this.type === 'long') {
      return ohlc.low <= this.config.stopLoss;
    }
    return ohlc.high >= this.config.stopLoss;
  }

  public get profitLoss(): number {
    if (this.isStatus('success'))
      return this.config.takeProfit - this.config.entryPrice;
    if (this.isStatus('fail'))
      return this.config.stopLoss - this.config.entryPrice;
    return 0;
  }
}

export type TradeStatus = 'await' | 'open' | 'success' | 'fail' | 'canceled';
