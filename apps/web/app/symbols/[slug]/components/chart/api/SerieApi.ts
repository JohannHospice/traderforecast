import {
  AreaSeriesPartialOptions,
  BarSeriesPartialOptions,
  BaselineSeriesPartialOptions,
  CandlestickSeriesPartialOptions,
  HistogramSeriesPartialOptions,
  ISeriesApi,
  LineSeriesPartialOptions,
  SeriesType,
} from 'lightweight-charts';
import { Api } from '.';
import { ChartApi } from './ChartApi';

export class SerieApi<T extends { time: string; value: number }[] = any>
  implements Api<ISeriesApi<SeriesType>>
{
  serieApi: ISeriesApi<SeriesType> | null = null;

  constructor(
    private chartApi: ChartApi,
    private lineOptions: LineOptions,
    private data: T,
    private type: SerieType
  ) {}

  api() {
    if (!this.serieApi) {
      this.serieApi =
        this.type === 'line'
          ? this.chartApi.api().addLineSeries(this.lineOptions)
          : this.chartApi.api().addAreaSeries(this.lineOptions);

      this.serieApi.setData(this.data);
    }
    return this.serieApi;
  }

  free() {
    if (!this.serieApi || this.chartApi.isRemoved) {
      return;
    }
    this.chartApi.freeSerie(this.serieApi);
  }
}

export type LineOptions =
  | AreaSeriesPartialOptions
  | BaselineSeriesPartialOptions
  | BarSeriesPartialOptions
  | CandlestickSeriesPartialOptions
  | HistogramSeriesPartialOptions
  | LineSeriesPartialOptions;

export type SerieType = 'line' | 'area' | 'bar' | 'candlestick' | 'histogram';
