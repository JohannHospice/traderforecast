import { Trade } from './trade';
import { WalletClient, Symbol } from '.';
import { MarketHandler, Market } from './market';
import { Exchange } from './exchange';

export class ExchangeProxy implements WalletClient, MarketHandler {
  constructor(private exchange: Exchange) {}

  addTrade(trade: Trade): void {
    this.exchange.getWallet().addTrade(trade);
  }

  cancelTrade(trade: Trade): void {
    this.exchange.getWallet().cancelTrade(trade);
  }

  get trades(): Trade[] {
    return this.exchange.getWallet().trades;
  }

  get activeTrades(): Trade[] {
    return this.exchange.getWallet().activeTrades;
  }

  get closedTrades(): Trade[] {
    return this.exchange.getWallet().closedTrades;
  }

  get balance(): number {
    return this.exchange.getWallet().balance;
  }

  getMarket(symbol: Symbol): Market {
    return this.exchange.getMarket(symbol);
  }
}
