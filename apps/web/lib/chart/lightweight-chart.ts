'use client';

import {
  DeepPartial,
  IChartApi,
  TimeChartOptions,
  createChart,
} from 'lightweight-charts';

export class LightWeightChartHandler {
  chart: IChartApi;
  handleResize?: () => void;
  element: HTMLDivElement;

  /**
   * FIXME: This is a workaround to fix the chart width when the window is resized
   * Hints:
   * - when the winddow is sized down the chart width is not updated because the element html keeps the same width
   * - this is maybe due to the css grid layout
   */
  offsetOnResize?: number;

  constructor(
    element: HTMLDivElement,
    options?: DeepPartial<TimeChartOptions>
  ) {
    this.chart = createChart(element, { ...options });
    this.config();
    this.element = element;
  }

  config() {
    this.chart.timeScale().fitContent();

    this.handleResize = () => {
      if (!this.offsetOnResize) {
        this.offsetOnResize = this.element.clientWidth - window.innerWidth;
      }
      this.chart.applyOptions({
        width: window.innerWidth + this.offsetOnResize,
      });
    };

    window.addEventListener('resize', this.handleResize);
  }

  remove() {
    window.removeEventListener('resize', this.handleResize!);
    this.chart.remove();
  }
}
