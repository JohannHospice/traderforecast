import { millisecondsToTime } from '@/lib/helpers/unit';
import { IChartApi, ISeriesApi, SeriesType } from 'lightweight-charts';
import { TrendLine } from '@traderforecast/lightweight-charts-plugin/trend-line/trend-line';
import { RectangleFactory } from '.';
import { Rectangle } from '../../indicators';

export class LightWeightRectangleFactory
  implements RectangleFactory<TrendLine[]>
{
  createRectangle(
    chart: IChartApi,
    series: ISeriesApi<SeriesType>,
    range: Rectangle
  ): TrendLine[] {
    const points = [
      {
        time: millisecondsToTime(range.openTime),
        price: range.close,
      },
      {
        time: millisecondsToTime(range.closeTime),
        price: range.close,
      },
      {
        time: millisecondsToTime(range.openTime),
        price: range.open,
      },
      {
        time: millisecondsToTime(range.closeTime),
        price: range.open,
      },
    ];

    return [
      new TrendLine(chart, series, points[0], points[1], {
        lineColor: range.color,
        showLabels: false,
        width,
      }),
      new TrendLine(chart, series, points[0], points[2], {
        lineColor: range.color,
        showLabels: false,
        width,
      }),
      new TrendLine(chart, series, points[1], points[3], {
        lineColor: range.color,
        showLabels: false,
        width,
      }),
      new TrendLine(chart, series, points[2], points[3], {
        lineColor: range.color,
        showLabels: false,
        width,
      }),
    ].map((trend) => {
      series.attachPrimitive(trend);
      return trend;
    });
  }
}
const width = 4;
