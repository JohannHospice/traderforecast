import api from '../../api';
import { OHLC, Symbol, Timeframe } from '..';
import { Market } from '.';
import { getTimeperiodIncrementInMs } from '../helpers/timeperiod';

export class ApiMarket implements Market {
  private ohlcs: OHLC[] = [];

  constructor(private symbol: Symbol) {}

  async getOHLC(time: number): Promise<OHLC> {
    let ohlc = this.findOHLC(time);

    if (!ohlc) {
      const maxFetchedTime = this.ohlcs[this.ohlcs.length - 1].openTime;
      const minFetchedTime = this.ohlcs[0].openTime;

      await this.getOHLCs({
        from: Math.min(time, minFetchedTime),
        to: Math.max(time, maxFetchedTime),
      });
    }
    ohlc = this.findOHLC(time);

    if (!ohlc) {
      throw new Error('OHLC not found');
    }

    return ohlc;
  }

  async getOHLCs(timeframe: Timeframe): Promise<OHLC[]> {
    if (
      this.ohlcs.length === 0 ||
      this.ohlcs[0].openTime > timeframe.from ||
      this.ohlcs[this.ohlcs.length - 1].openTime < timeframe.to
    ) {
      const { klines } = await api.market.getKlinesAndSymbol({
        interval: this.symbol.timeperiod as IntervalKeys,
        slug: this.symbol.key,
        startTime: timeframe.from,
      });

      this.ohlcs = this.ohlcs
        .concat(klines)
        // remove duplicates
        .filter(
          (ohlcs, index, self) =>
            self.findIndex((t) => t.openTime === ohlcs.openTime) === index
        )
        // sort by openTime
        .sort((a, b) => a.openTime - b.openTime);
    }

    return this.ohlcs.filter(
      (ohlcs) =>
        ohlcs.openTime >= timeframe.from && ohlcs.openTime < timeframe.to
    );
  }

  // TODO maybe hiding some bugs
  findOHLC(time: number): OHLC | undefined {
    return this.ohlcs.find((ohlcs) => this.isSameTime(ohlcs.openTime, time));
  }

  isSameTime(t1: number, t2: number): boolean {
    const approx = getTimeperiodIncrementInMs(this.symbol.timeperiod);
    return Math.abs(t1 - t2) < approx;
  }
}
