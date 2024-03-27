import { IChartApi, ISeriesApi, SeriesType } from 'lightweight-charts';
import { Rectangle } from '../../indicators';

export interface RectangleFactory<T> {
  createRectangle(
    chart: IChartApi,
    series: ISeriesApi<SeriesType>,
    options: Rectangle
  ): T;
}
