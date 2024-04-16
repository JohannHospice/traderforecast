import api from '../../../api';
import { OHLC, Symbol, Timeframe } from '..';
import { Market } from '.';
import { getTimeperiodIncrementInMs } from '../helpers/timeperiod';

export class BacktestApiMarket implements Market {
  private ohlcs: OHLC[] = [];
  private loadCount = 0;
  private periodInterval: number;
  private loadTimeOffset = 5000;

  constructor(private symbol: Symbol) {
    this.periodInterval = getTimeperiodIncrementInMs(symbol.timeperiod) - 1;
  }

  async getOHLC(time: number): Promise<OHLC> {
    const timeframe = {
      from: time,
      to: time,
    };
    if (this.shouldLoad(timeframe)) {
      await this.load(timeframe);
    }

    const ohlc = BacktestApiMarket.findOHLC(
      this.ohlcs,
      time,
      this.periodInterval
    );

    if (!ohlc) {
      throw new Error('OHLC not found');
    }

    return ohlc;
  }

  async getOHLCs(timeframe: Timeframe): Promise<OHLC[]> {
    if (this.shouldLoad(timeframe)) {
      await this.load(timeframe);
    }

    return BacktestApiMarket.filterOHLCs(this.ohlcs, timeframe);
  }

  shouldLoad(timeframe: Timeframe): boolean {
    return (
      this.ohlcs.length === 0 ||
      this.ohlcs[0].openTime > timeframe.from ||
      this.ohlcs[this.ohlcs.length - 1].openTime < timeframe.to
    );
  }

  async load(timeframe: Timeframe): Promise<void> {
    // TODO: to optimize the loading, we load a little more data than requested
    const extraTimeLoaded = this.loadTimeOffset * this.periodInterval;
    const ohlcs = await api.realtimeMarket.getOHLCs({
      startTime: timeframe.from - extraTimeLoaded,
      endTime: timeframe.to + extraTimeLoaded,
      interval: this.symbol.timeperiod as IntervalKeys,
      slug: this.symbol.key,
    });

    const concatOhlcs = this.ohlcs.concat(ohlcs);
    // remove duplicates
    const filteredOhlcs = concatOhlcs.filter(
      (ohlcs, index, self) =>
        self.findIndex((t) => t.openTime === ohlcs.openTime) === index
    );
    console.log('duplicates', concatOhlcs.length - filteredOhlcs.length);
    // sort by openTime
    this.ohlcs = filteredOhlcs.sort((a, b) => a.openTime - b.openTime);
    this.loadCount++;
  }

  static filterOHLCs(ohlcs: OHLC[], timeframe: Timeframe): OHLC[] {
    return ohlcs.filter(
      (ohlcs) =>
        ohlcs.openTime >= timeframe.from && ohlcs.openTime <= timeframe.to
    );
  }

  static findOHLC(
    ohlcs: OHLC[],
    time: number,
    approximation: number
  ): OHLC | undefined {
    return ohlcs.find(({ openTime }) =>
      BacktestApiMarket.isSameTime(openTime, time, approximation)
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
