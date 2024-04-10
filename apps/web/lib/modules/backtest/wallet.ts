import { Trade } from './trade';
import { OHLC, WalletClient } from '.';

export class Wallet implements WalletClient {
  private trades: Trade[] = [];
  constructor(readonly initialBalance: number = 0) {}

  updateTrades(ohlc: OHLC): void {
    this.activeTrades.forEach((trade) => trade.update(ohlc));
  }

  addTrade(trade: Trade): void {
    this.trades.push(trade);
  }

  cancelTrade(trade: Trade): void {
    const tradeToCancel = this.trades.find((t) => t === trade);
    if (tradeToCancel) {
      tradeToCancel.cancel();
    }
  }

  get activeTrades(): Trade[] {
    return this.trades.filter((trade) => trade.isActive());
  }

  get closedTrades(): Trade[] {
    return this.trades.filter((trade) => trade.isClosed());
  }

  get balance(): number {
    return this.trades.reduce(
      (acc, trade) => acc + trade.profitLoss,
      this.initialBalance
    );
  }
}
