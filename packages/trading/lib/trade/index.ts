import { TradeStatus, TradeType } from '@traderforecast/database';
import { OHLC } from '..';

export class Trade {
  public ohlcClose?: OHLC;
  public status: TradeStatus = TradeStatus.AWAIT;
  constructor(
    public config: {
      entryPrice: number;
      takeProfit: number;
      stopLoss: number;
      entryTime?: number;
      amount: number;
      tradingFees?: number;
      createdTime?: number;
    }
  ) {
    if (
      config.takeProfit < config.entryPrice &&
      config.stopLoss < config.entryPrice
    ) {
      throw new Error(
        'Entry price must not be greater than take profit and stop loss'
      );
    }
    if (
      config.takeProfit > config.entryPrice &&
      config.stopLoss > config.entryPrice
    ) {
      throw new Error(
        'Entry price must not be less than take profit and stop loss'
      );
    }
    if (
      config.takeProfit === config.stopLoss ||
      config.entryPrice === config.takeProfit
    ) {
      throw new Error(
        'Take profit, stop loss and entry price must be different'
      );
    }

    if (this.config.entryTime) {
      this.status = TradeStatus.OPEN;
    }
  }

  update(ohlc: OHLC): void {
    if (!this.config.createdTime) {
      this.config.createdTime = ohlc.openTime;
    }

    if (this.isStatus(TradeStatus.AWAIT) && this.hitEntryPrice(ohlc)) {
      this.status = TradeStatus.OPEN;
      this.config.entryTime = ohlc.openTime;
      return;
    }

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

    if (
      this.isStatus(TradeStatus.OPEN_CANCELLED, TradeStatus.AWAIT_CANCELLED) &&
      !this.ohlcClose
    ) {
      this.ohlcClose = ohlc;
      return;
    }
  }

  cancel(): void {
    if (this.isStatus(TradeStatus.OPEN)) {
      this.status = TradeStatus.OPEN_CANCELLED;
    }
    if (this.isStatus(TradeStatus.AWAIT)) {
      this.status = TradeStatus.AWAIT_CANCELLED;
    }
  }

  isActive(): boolean {
    return (
      this.isStatus(TradeStatus.OPEN, TradeStatus.AWAIT) ||
      (this.isStatus(TradeStatus.OPEN_CANCELLED, TradeStatus.AWAIT_CANCELLED) &&
        !this.ohlcClose)
    );
  }

  isClosed(): boolean {
    return !this.isActive();
  }

  isStatus(...status: TradeStatus[]): boolean {
    return status.includes(this.status);
  }

  public get type(): TradeType {
    return this.config.entryPrice > this.config.takeProfit
      ? TradeType.SHORT
      : TradeType.LONG;
  }

  public hitEntryPrice(ohlc: OHLC): boolean {
    return (
      ohlc.high >= this.config.entryPrice && ohlc.low <= this.config.entryPrice
    );
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

  public get profitLossRaw(): number {
    if (this.isStatus(TradeStatus.SUCCESS)) {
      return this.type === TradeType.LONG
        ? this.config.takeProfit - this.config.entryPrice
        : this.config.entryPrice - this.config.takeProfit;
    }

    if (this.isStatus(TradeStatus.FAILED)) {
      return this.type === TradeType.LONG
        ? this.config.stopLoss - this.config.entryPrice
        : this.config.entryPrice - this.config.stopLoss;
    }

    if (this.isStatus(TradeStatus.OPEN_CANCELLED) && !!this.ohlcClose) {
      return this.config.entryPrice - this.ohlcClose.open;
    }

    return 0;
  }

  public get profitLoss(): number {
    return (
      this.profitLossRaw *
      this.config.amount *
      (1 - (this.config.tradingFees || 0))
    );
  }

  public get profitLossRatio(): number {
    return this.profitLossRaw / this.config.entryPrice;
  }

  public get balance(): number {
    return this.config.amount * this.config.entryPrice;
  }

  static distance(x: number, y: number): number {
    return Math.abs(x - y);
  }

  static buyAmount(balance: number, price: number): number {
    return balance / price;
  }

  static addMargin(price: number, margin: number): number {
    return price * (1 + margin);
  }
}
