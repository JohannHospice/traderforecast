import { IChartApi, ISeriesApi, SeriesType } from 'lightweight-charts';
import { TrendLine } from '@traderforecast/lightweight-charts-plugin/trend-line/trend-line';
import { TrendFactory } from '.';
import { Trendline } from '../../indicators';
import { millisecondsToTime } from '../../helpers/lightweight-charts';

export class LightWeightTrendFactory implements TrendFactory<TrendLine> {
  createTrend(
    chart: IChartApi,
    series: ISeriesApi<SeriesType>,
    range: Trendline
  ): TrendLine {
    const trend = new TrendLine(
      chart,
      series,
      {
        time: millisecondsToTime(range.openTime),
        price: range.open,
      },
      {
        time: millisecondsToTime(range.closeTime),
        price: range.close,
      },
      {
        lineColor: range.color,
        showLabels: false,
        width,
      }
    );
    series.attachPrimitive(trend);
    return trend;
  }
}
const width = 4;
