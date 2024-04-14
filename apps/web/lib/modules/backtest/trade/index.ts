import { TradeStatus, TradeType } from '@prisma/client';
import { OHLC } from '..';

export class Trade {
  public ohlcClose?: OHLC;
  public status: TradeStatus = TradeStatus.OPEN;
  constructor(
    public config: {
      entryPrice: number;
      takeProfit: number;
      stopLoss: number;
      entryTime: number;
    }
  ) {}

  update(ohlc: OHLC): void {
    if (!this.isStatus(TradeStatus.OPEN)) return;

    if (this.hitTakeProfit(ohlc)) {
      this.status = TradeStatus.SUCCESS;
      this.ohlcClose = ohlc;
    }

    if (this.hitStopLoss(ohlc)) {
      this.status = TradeStatus.FAILED;
      this.ohlcClose = ohlc;
    }
  }

  cancel(): void {
    // if (!this.isStatus('AWAIT')) {
    //   throw new Error('Trade can only be canceled if it is awaiting');
    // }

    // todo register cancel pricxe
    this.status = TradeStatus.CANCELLED;
  }

  isActive(): boolean {
    return this.isStatus(TradeStatus.OPEN, 'AWAIT');
  }

  isClosed(): boolean {
    return this.isStatus(
      TradeStatus.SUCCESS,
      TradeStatus.FAILED,
      TradeStatus.CANCELLED
    );
  }

  isStatus(...status: TradeStatus[]): boolean {
    return status.includes(this.status);
  }

  public get type(): TradeType {
    return this.config.entryPrice > this.config.takeProfit
      ? TradeType.SHORT
      : TradeType.LONG;
  }

  public hitTakeProfit(ohlc: OHLC): boolean {
    if (this.type === TradeType.LONG) {
      return ohlc.high >= this.config.takeProfit;
    }
    return ohlc.low <= this.config.takeProfit;
  }
  public hitStopLoss(ohlc: OHLC): boolean {
    if (this.type === TradeType.LONG) {
      return ohlc.low <= this.config.stopLoss;
    }
    return ohlc.high >= this.config.stopLoss;
  }

  public get profitLoss(): number {
    if (this.isStatus(TradeStatus.SUCCESS))
      return this.config.takeProfit - this.config.entryPrice;
    if (this.isStatus(TradeStatus.FAILED))
      return this.config.stopLoss - this.config.entryPrice;
    return 0;
  }
}
