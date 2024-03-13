'use client';
import { SeriesMarker, Time } from 'lightweight-charts';

export interface MarkerDetector {
  execute(klines: Kline[]): SeriesMarker<Time>[];
}
