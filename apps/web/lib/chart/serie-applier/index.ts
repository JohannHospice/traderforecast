'use client';
import { ISeriesApi, SeriesType } from 'lightweight-charts';

export interface SerieApplier {
  apply(series: ISeriesApi<SeriesType>, klines: Kline[]): void;
}
