import { Symbol, Timeframe } from '.';
import { Exchange } from './exchange';
import { getTimeperiodIncrementInMs } from './helpers/timeperiod';
import { Market } from './market';
import { Strategy } from './strategies';
import { Wallet } from './wallet';

export class Backtester {
  private exchange: Exchange;
  public timeframe?: Timeframe;

  constructor(
    public strategy: Strategy,
    Market: new (options: any) => Market,
    initialBalance: number,
    marketOptions: any
  ) {
    this.exchange = new Exchange(
      new Wallet(initialBalance),
      Market,
      marketOptions
    );
  }

  async run(timeframe: Timeframe): Promise<void> {
    this.timeframe = timeframe;
    const increment = getTimeperiodIncrementInMs(
      this.strategy.symbol.timeperiod
    );

    const errorTimes = [];

    const executionTimes = [];
    let id = 0;
    for (let time = timeframe.from; time < timeframe.to; time += increment) {
      try {
        const t1 = performance.now();
        await this.strategy.onTime(time, this.exchange.proxy);
        const t2 = performance.now();
        await this.updateWallet(time);
        const t3 = performance.now();
        executionTimes.push({
          id: id,
          time,
          onTime: t2 - t1,
          updateWallet: t3 - t2,
        });
        id++;
      } catch (e: any) {
        if (e.message === 'OHLC not found') {
          errorTimes.push(time);
          continue;
        }
        console.error(`Error at time ${time}`, e);
      }
    }

    console.log({ errorTimes, executionTimes });
  }

  async updateWallet(time: number): Promise<void> {
    const ohlc = await this.exchange
      .getMarket(this.strategy.symbol)
      .getOHLC(time);

    await this.exchange.updateTrades(ohlc);
  }

  getWallet(): Wallet {
    return this.exchange.getWallet();
  }

  get symbol(): Symbol {
    return this.strategy.symbol;
  }
}
