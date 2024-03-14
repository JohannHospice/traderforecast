'use client';
import { ISeriesApi, SeriesMarker, SeriesType, Time } from 'lightweight-charts';
import { ChartDetector } from '../detector';
import { ChartApplier } from '.';

export class MarkerDetectorApplier<T extends SeriesMarker<Time>[]>
  implements ChartApplier
{
  private detector: ChartDetector<T>;

  constructor(detector: ChartDetector<T>) {
    this.detector = detector;
  }

  apply(series: ISeriesApi<SeriesType>, klines: Kline[]): void {
    series.setMarkers(this.detector.execute(klines));
  }
}
