import {
  AreaSeriesPartialOptions,
  BarSeriesPartialOptions,
  BaselineSeriesPartialOptions,
  CandlestickSeriesPartialOptions,
  ChartOptions,
  DeepPartial,
  HistogramSeriesPartialOptions,
  IChartApi,
  ISeriesApi,
  LayoutOptions,
  LineSeriesPartialOptions,
  SeriesType,
  createChart,
} from 'lightweight-charts';

export interface Api<T = any, F = any> {
  api: () => T;
  free: (data?: F) => void;
}

export class SerieApi<T extends { time: string; value: number }[]>
  implements Api<ISeriesApi<SeriesType>>
{
  serieApi: ISeriesApi<SeriesType> | null = null;

  constructor(
    private chartApi: ChartApi,
    private lineOptions:
      | AreaSeriesPartialOptions
      | BaselineSeriesPartialOptions
      | BarSeriesPartialOptions
      | CandlestickSeriesPartialOptions
      | HistogramSeriesPartialOptions
      | LineSeriesPartialOptions,
    private data: T,
    private type: string
  ) {}

  api() {
    if (!this.serieApi) {
      this.serieApi = (
        this.type === 'line'
          ? this.chartApi.api().addLineSeries(this.lineOptions)
          : this.chartApi.api().addAreaSeries(this.lineOptions)
      ) as ISeriesApi<SeriesType>;

      this.serieApi.setData(this.data);
    }
    return this.serieApi;
  }

  free() {
    // check if parent component was removed already
    if (this.serieApi && !this.chartApi.isRemoved) {
      // remove only current series
      this.chartApi.free(this.serieApi);
    }
  }
}

export class ChartApi implements Api<IChartApi, ISeriesApi<SeriesType>> {
  isRemoved = false;
  chartApi: null | IChartApi = null;

  constructor(
    private container: HTMLElement,
    private layout: LayoutOptions,
    private rest: DeepPartial<ChartOptions>
  ) {}

  api() {
    if (!this.chartApi) {
      this.chartApi = createChart(this.container, {
        ...this.rest,
        layout: this.layout,
        width: this.container.clientWidth,
        height: 300,
      });
      this.chartApi.timeScale().fitContent();
    }

    return this.chartApi;
  }

  free(series?: ISeriesApi<SeriesType>) {
    if (this.chartApi && series) {
      this.chartApi.removeSeries(series);
    }
  }
}
