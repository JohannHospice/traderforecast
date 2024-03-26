import { IChartApi, ISeriesApi, SeriesType } from 'lightweight-charts';
import { Rectangle } from '../../indicator';

export interface RectangleFactory<T> {
  createRectangle(
    chart: IChartApi,
    series: ISeriesApi<SeriesType>,
    options: Rectangle
  ): T;
}
