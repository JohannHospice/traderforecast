'use client';
import { ISeriesApi, SeriesType } from 'lightweight-charts';

// series.setMarkers(markers);

export interface ChartApplier {
  apply(series: ISeriesApi<SeriesType>, klines: Kline[]): void;
}
