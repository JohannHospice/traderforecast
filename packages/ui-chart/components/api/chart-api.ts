import {
  ChartOptions,
  DeepPartial,
  IChartApi,
  ISeriesApi,
  SeriesType,
  Time,
  createChart,
} from 'lightweight-charts';

export class ChartApi {
  get isRemoved() {
    return this.chartApi === null;
  }

  private chartApi: null | IChartApi = null;

  constructor(
    private container: HTMLElement,
    private options: DeepPartial<ChartOptions>
  ) {}

  api() {
    if (!this.chartApi) {
      this.chartApi = createChart(this.container, {
        ...this.options,
        width: this.container.clientWidth,
        height: this.container.clientHeight,
      });
      this.chartApi.timeScale().fitContent();
    }

    return this.chartApi;
  }

  freeSerie(series?: ISeriesApi<SeriesType, Time>) {
    if (!this.chartApi || !series) {
      return;
    }
    this.chartApi.removeSeries(series);
  }

  free() {
    if (!this.chartApi) {
      return;
    }
    this.chartApi.remove();
    this.chartApi = null;
  }
}
