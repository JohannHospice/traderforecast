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
}
