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
    const [ohlc] = await this.getOHLCs({
      from: time,
      to: time,
    });

    if (!ohlc) {
      throw new Error('OHLC not found');
    }

    return ohlc;
  }

  async getOHLCs(timeframe: Timeframe): Promise<OHLC[]> {
    if (this.shouldLoad(timeframe)) {
      await this.load(timeframe);
    }

    return ApiMarket.filterOHLCs(this.ohlcs, timeframe);
  }

  shouldLoad(timeframe: Timeframe): boolean {
    return (
      this.ohlcs.length === 0 ||
      this.ohlcs[0].openTime > timeframe.from ||
      this.ohlcs[this.ohlcs.length - 1].openTime < timeframe.to
    );
  }

  async load(timeframe: Timeframe): Promise<void> {
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

  static filterOHLCs(ohlcs: OHLC[], timeframe: Timeframe): OHLC[] {
    return ohlcs.filter(
      (ohlcs) =>
        ohlcs.openTime >= timeframe.from && ohlcs.openTime <= timeframe.to
    );
  }

  // TODO maybe hiding some bugs
  static findOHLC(
    ohlcs: OHLC[],
    time: number,
    approximation: number
  ): OHLC | undefined {
    return ohlcs.find(({ openTime }) =>
      ApiMarket.isSameTime(openTime, time, approximation)
    );
  }

  static isSameTime(
    t1: number,
    t2: number,
    approximation: number = 0
  ): boolean {
    return Math.abs(t1 - t2) <= approximation;
  }
}
