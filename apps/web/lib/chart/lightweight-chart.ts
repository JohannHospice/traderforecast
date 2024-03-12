'use client';
import {
  CandlestickData,
  DeepPartial,
  IChartApi,
  Time,
  TimeChartOptions,
  UTCTimestamp,
  WhitespaceData,
  createChart,
} from 'lightweight-charts';

export class LightWeightChartHandler {
  chart: IChartApi;
  handleResize?: () => void;
  element: HTMLDivElement;

  constructor(
    element: HTMLDivElement,
    options?: DeepPartial<TimeChartOptions>
  ) {
    this.chart = createChart(element, options);
    this.config();
    this.element = element;
  }

  config() {
    this.chart.timeScale().fitContent();
    this.handleResize = () => {
      this.chart.applyOptions({
        width: this.element.clientWidth,
        height: this.element.clientHeight,
      });
    };
    window.addEventListener('resize', this.handleResize);
  }

  remove() {
    window.removeEventListener('resize', this.handleResize!);
    this.chart.remove();
  }

  klinesToCandlestickSeries(
    klines: Kline[]
  ): (WhitespaceData<Time> | CandlestickData<Time>)[] {
    return klines.map((k) => this.klineToCandlestick(k));
  }

  klineToCandlestick(kline: Kline): CandlestickData<Time> {
    return {
      time: (kline.closeTime / 1000) as UTCTimestamp,
      open: kline.open,
      high: kline.high,
      low: kline.low,
      close: kline.close,
    };
  }
}
