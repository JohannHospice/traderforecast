'use client';
import dayjs from 'dayjs';
import {
  createChart,
  DeepPartial,
  TimeChartOptions,
  IChartApi,
  AreaStyleOptions,
  SeriesOptionsCommon,
  AreaData,
  Time,
  WhitespaceData,
  ISeriesApi,
  SeriesType,
  CandlestickData,
  UTCTimestamp,
} from 'lightweight-charts';

export class LightWeightChartHandler {
  chart: IChartApi;
  handleResize?: () => void;

  constructor(
    element: HTMLDivElement,
    options?: DeepPartial<TimeChartOptions>
  ) {
    this.chart = createChart(element, options);
    this.config();
  }

  config() {
    this.chart.timeScale().fitContent();
    this.handleResize = () => {
      this.chart.applyOptions({
        width: this.chart.chartElement().clientWidth,
        height: this.chart.chartElement().clientHeight,
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
    return klines.map((k) => ({
      time: (k.closeTime / 1000) as UTCTimestamp,
      open: k.open,
      high: k.high,
      low: k.low,
      close: k.close,
    }));
  }
}
