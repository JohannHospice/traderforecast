import {
  ISeriesApi,
  SeriesDataItemTypeMap,
  SeriesPartialOptionsMap,
  SeriesType,
  Time,
} from 'lightweight-charts';
import { ChartApi } from './chart-api';

export class SerieApi {
  private serieApi: ISeriesApi<SeriesType, Time> | null = null;

  constructor(
    private chartApi: ChartApi,
    private lineOptions: SeriesPartialOptionsMap[SeriesType],
    private data: SeriesDataItemTypeMap<Time>[SeriesType][],
    private type: SeriesType
  ) {}

  api() {
    if (!this.serieApi) {
      this.serieApi = this.addSeries();
      this.serieApi.setData(this.data);
    }
    return this.serieApi;
  }

  free() {
    if (!this.serieApi || this.chartApi.isRemoved) {
      return;
    }
    this.chartApi.freeSerie(this.serieApi as any);
    this.serieApi = null;
  }

  private get addSeries() {
    const api = this.chartApi.api();
    const actions = {
      Line: () => api.addLineSeries(this.lineOptions),
      Area: () => api.addAreaSeries(this.lineOptions),
      Candlestick: () => api.addCandlestickSeries(this.lineOptions),
      Bar: () => api.addBarSeries(this.lineOptions),
      Histogram: () => api.addHistogramSeries(this.lineOptions),
      Baseline: () => api.addBaselineSeries(this.lineOptions),
      Custom: () => {
        throw new Error('Custom series is not supported');
      },
    } as unknown as Record<SeriesType, () => ISeriesApi<SeriesType, Time>>;
    return actions[this.type];
  }
}
