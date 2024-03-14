'use client';

export interface ChartDetector<T = any> {
  execute(klines: Kline[]): T;
}
