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

    const errorTimes = [];
    const cleanTimes = [];

    for (let time = timeframe.from; time < timeframe.to; time += increment) {
      try {
        await this.strategy.onTime(time, this.exchange.proxy);
        await this.updateWallet(time);
        cleanTimes.push(time);
      } catch (e: any) {
        if (e.message === 'OHLC not found') {
          errorTimes.push(time);
          continue;
        }
        console.error(`Error at time ${time}`, e);
      }
    }

    console.log({ errorTimes, cleanTimes });
  }

  async updateWallet(time: number): Promise<void> {
    const ohlc = await this.exchange.getMarket(this.symbol).getOHLC(time);

    await this.exchange.updateTrades(ohlc);
  }

  getWallet(): Wallet {
    return this.exchange.getWallet();
  }
}
