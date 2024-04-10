import api from '../../../api';
import { OHLC, Symbol, Timeframe } from '..';
import { Market } from '.';
import { getTimeperiodIncrementInMs } from '../helpers/timeperiod';

export class ApiMarket implements Market {
  private ohlcs: OHLC[] = [];
  private extraTimeLoaded: number;

  constructor(private symbol: Symbol) {
    this.extraTimeLoaded = getTimeperiodIncrementInMs(symbol.timeperiod) * 100;
  }

  async getOHLC(time: number): Promise<OHLC> {
    const ohlc = this.findOHLC(time);
    if (ohlc) {
      return ohlc;
    }
    const ohlcs = await this.getOHLCs({
      from: Math.min(time, this.ohlcs[0]?.openTime),
      to: Math.max(time, this.ohlcs[this.ohlcs.length - 1]?.openTime),
    });
    return ohlcs[ohlcs.length - 1];
  }

  async getOHLCs(timeframe: Timeframe): Promise<OHLC[]> {
    const shouldFetch =
      this.ohlcs.length === 0 ||
      this.ohlcs[0].openTime > timeframe.from ||
      this.ohlcs[this.ohlcs.length - 1].openTime < timeframe.to;

    if (shouldFetch) {
      const ohlcs = await api.realtimeMarket.getOHLCs({
        startTime: timeframe.from - this.extraTimeLoaded,
        endTime: timeframe.to + this.extraTimeLoaded,
        interval: this.symbol.timeperiod as IntervalKeys,
        slug: this.symbol.key,
      });

      this.ohlcs = this.ohlcs
        .concat(ohlcs)
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
  private findOHLC(time: number): OHLC | undefined {
    return this.ohlcs.find((ohlcs) => this.isSameTime(ohlcs.openTime, time));
  }

  private isSameTime(t1: number, t2: number): boolean {
    const approx = getTimeperiodIncrementInMs(this.symbol.timeperiod);
    return Math.abs(t1 - t2) < approx;
  }
}
