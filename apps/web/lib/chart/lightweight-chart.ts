'use client';

import {
  CandlestickData,
  DeepPartial,
  IChartApi,
  ISeriesApi,
  Time,
  TimeChartOptions,
  WhitespaceData,
  createChart,
} from 'lightweight-charts';
import { millisecondsToTime } from '../helpers/unit';

export class LightWeightChartHandler {
  chart: IChartApi;
  handleResize?: () => void;
  element: HTMLDivElement;
  realtimeTimeout?: NodeJS.Timeout;

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
    clearInterval(this.realtimeTimeout);
  }

  klinesToCandlestickSeries(
    klines: Kline[]
  ): (WhitespaceData<Time> | CandlestickData<Time>)[] {
    return klines.map((k) => this.klineToCandlestick(k));
  }

  klineToCandlestick(kline: Kline): CandlestickData<Time> {
    return {
      time: millisecondsToTime(kline.closeTime),
      open: kline.open,
      high: kline.high,
      low: kline.low,
      close: kline.close,
    };
  }

  realTimeUpdate({
    series,
    url,
  }: {
    series: ISeriesApi<'Candlestick'>;
    url: string;
  }) {
    this.realtimeTimeout = setInterval(
      () =>
        fetch(url)
          .then((res) => res.json())
          .then((kline) => {
            series.update(this.klineToCandlestick(kline));
          }),
      1000
    );
  }
}
