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
  ) {
    if (
      (config.takeProfit < config.entryPrice &&
        config.stopLoss < config.entryPrice) ||
      (config.takeProfit > config.entryPrice &&
        config.stopLoss > config.entryPrice) ||
      config.takeProfit === config.stopLoss ||
      config.entryPrice === config.takeProfit
    ) {
      throw new Error('Invalid trade configuration');
    }
  }

  update(ohlc: OHLC): void {
    if (this.isStatus(TradeStatus.OPEN)) {
      if (this.hitTakeProfit(ohlc)) {
        this.status = TradeStatus.SUCCESS;
        this.ohlcClose = ohlc;
        return;
      }

      if (this.hitStopLoss(ohlc)) {
        this.status = TradeStatus.FAILED;
        this.ohlcClose = ohlc;
        return;
      }

      return;
    }

    if (this.isStatus(TradeStatus.CANCELLED) && !this.ohlcClose) {
      this.ohlcClose = ohlc;
      return;
    }
  }

  cancel(): void {
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
