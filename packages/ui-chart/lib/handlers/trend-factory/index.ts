import { IChartApi, ISeriesApi, SeriesType } from 'lightweight-charts';
import { Trendline } from '../../indicators';

export interface TrendFactory<T> {
  createTrend(
    chart: IChartApi,
    series: ISeriesApi<SeriesType>,
    options: Trendline
  ): T;
}
