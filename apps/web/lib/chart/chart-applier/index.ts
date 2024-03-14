'use client';
import { IChartApi, ISeriesApi, SeriesType } from 'lightweight-charts';
import { SerieApplier } from '../serie-applier';

export interface ChartApplier {
  add(klines: Kline[]): void;
  apply(serieAppliers: SerieApplier[]): void;
  update(klines: Kline[]): void;
  clear(): void;
}
