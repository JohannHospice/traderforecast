import { Exchange } from './exchange';
import { getTimeperiodIncrementInMs } from './helpers/timeperiod';
import { Market } from './market';
import { Strategy } from './strategies';
import { Symbol, Timeframe } from '.';
import { Wallet } from './wallet';

export class Backtester {
  private exchange: Exchange;

  constructor(
    private symbol: Symbol,
    private strategy: Strategy,
    Market: new (symbol: Symbol) => Market,
    initialBalance: number
  ) {
    this.exchange = new Exchange(new Wallet(initialBalance), Market);
  }

  async run(timeframe: Timeframe): Promise<void> {
    const increment = getTimeperiodIncrementInMs(this.symbol.timeperiod);

    for (let time = timeframe.from; time < timeframe.to; time += increment) {
      await this.strategy.onTime(time, this.exchange.proxy);
      await this.updateWallet(time);
    }
  }

  async updateWallet(time: number): Promise<void> {
    const ohlc = await this.exchange.getMarket(this.symbol).getOHLC(time);

    await this.exchange.updateTrades(ohlc);
  }

  getWallet(): Wallet {
    return this.exchange.getWallet();
  }
}
