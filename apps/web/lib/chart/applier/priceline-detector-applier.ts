'use client';
import {
  CreatePriceLineOptions,
  ISeriesApi,
  SeriesType,
} from 'lightweight-charts';
import { ChartDetector } from '../detector';
import { ChartApplier } from '.';

export class PriceLineDetectorApplier<T extends CreatePriceLineOptions[]>
  implements ChartApplier
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
