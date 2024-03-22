import {
  ChartOptions,
  DeepPartial,
  IChartApi,
  ISeriesApi,
  LayoutOptions,
  SeriesType,
  createChart,
} from 'lightweight-charts';
import { Api } from '.';

export class ChartApi implements Api<IChartApi> {
  get isRemoved() {
    return this.chartApi === null
  };
  
  chartApi: null | IChartApi = null;

  constructor(
    private container: HTMLElement,
    private options: DeepPartial<ChartOptions>
  ) {}

  api() {

  console.log('init ChartApi');

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

  free() {
    if (this.chartApi) {
      this.chartApi.remove();
      this.chartApi = null
    }
  }

  freeSerie(series?: ISeriesApi<SeriesType>) {
    if (this.chartApi && series) {
      this.chartApi.removeSeries(series);
      this.chartApi.remove();
    }
  }
}
