'use client';
import {
  CreatePriceLineOptions,
  ISeriesApi,
  SeriesType,
} from 'lightweight-charts';
import { ChartDetector } from './detector';
import { SerieApplier } from '.';

export class PriceLineSerieApplier<T extends CreatePriceLineOptions[]>
  implements SerieApplier
{
  private detector: ChartDetector<T>;

  constructor(detector: ChartDetector<T>) {
    this.detector = detector;
  }

  apply(series: ISeriesApi<SeriesType>, klines: Kline[]): void {
    this.detector
      .execute(klines)
      .forEach((priceLine) => series.createPriceLine(priceLine));
  }
}
