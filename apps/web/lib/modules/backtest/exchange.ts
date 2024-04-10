import { OHLC, Symbol, TimePeriod } from '.';
import { Market, MarketHandler } from './market';
import { ExchangeProxy } from './exchange-proxy';
import { Wallet } from './wallet';

export class Exchange implements MarketHandler {
  private markets: Record<string, Market> = {};
  readonly proxy: ExchangeProxy = new ExchangeProxy(this);

  constructor(
    private wallet: Wallet,
    private Market: new (symbol: Symbol) => Market
  ) {}

  getWallet(): Wallet {
    return this.wallet;
  }

  async updateTrades(ohlc: OHLC): Promise<void> {
    this.wallet.updateTrades(ohlc);
  }

  getMarket(symbol: Symbol): Market {
    const key = this.createMarketKey(symbol);
    if (!this.markets[key]) {
      this.markets[key] = new this.Market({
        key: symbol.key,
        timeperiod: symbol.timeperiod as TimePeriod,
      });
    }

    return this.markets[key];
  }

  private createMarketKey(symbol: Symbol): string {
    return Object.values(symbol).join(':');
  }
}
