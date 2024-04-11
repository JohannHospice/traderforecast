import { Trade } from './trade';
import { OHLC, WalletClient } from '.';

export class Wallet implements WalletClient {
  private _trades: Trade[] = [];

  private _mutex: boolean = false;
  private _activeTrades: Trade[] = [];
  private _closedTrades: Trade[] = [];
  private _balance: number = 0;

  constructor(readonly initialBalance: number = 0) {}

  updateTrades(ohlc: OHLC): void {
    this.activeTrades.forEach((trade) => trade.update(ohlc));
    this._mutex = true;
  }

  addTrade(trade: Trade): void {
    this._trades.push(trade);
    this._mutex = true;
  }

  cancelTrade(trade: Trade): void {
    const tradeToCancel = this._trades.find((t) => t === trade);
    if (tradeToCancel) {
      tradeToCancel.cancel();
      this._mutex = true;
    }
  }

  get trades(): Trade[] {
    return this._trades;
  }

  get activeTrades(): Trade[] {
    if (this._mutex) {
      this.resetMutex();
    }
    return this._activeTrades;
  }

  get closedTrades(): Trade[] {
    if (this._mutex) {
      this.resetMutex();
    }
    return this._closedTrades;
  }

  get balance(): number {
    if (this._mutex) {
      this.resetMutex();
    }
    return this._balance;
  }

  private resetMutex(): void {
    this._activeTrades = this._trades.filter((trade) => trade.isActive());
    this._closedTrades = this._trades.filter((trade) => trade.isClosed());
    this._balance = this._trades.reduce(
      (acc, trade) => acc + trade.profitLoss,
      this.initialBalance
    );
    this._mutex = false;
  }
}
