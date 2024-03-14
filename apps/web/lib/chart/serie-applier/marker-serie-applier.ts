'use client';
import { ISeriesApi, SeriesMarker, SeriesType, Time } from 'lightweight-charts';
import { ChartDetector } from './detector';
import { SerieApplier } from '.';

export class MarkerSerieApplier<T extends SeriesMarker<Time>[]>
  implements SerieApplier
{
  private detector: ChartDetector<T>;

  constructor(detector: ChartDetector<T>) {
    this.detector = detector;
  }

  apply(series: ISeriesApi<SeriesType>, klines: Kline[]): void {
    series.setMarkers(this.detector.execute(klines));
  }
}
