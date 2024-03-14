'use client';

export interface Indicator {
  execute(klines: Kline[]): IndicatorResult;
}

export type IndicatorResult = {
  markers?: Marker[];
  priceLines?: PriceLine[];
};

export type Marker = {
  time: number;
  price?: number;
  color?: string;
  position?: 'aboveBar' | 'belowBar' | 'inBar';
  shape?: 'circle' | 'square' | 'arrowUp' | 'arrowDown';
};

export type PriceLine = {
  price: number;
  color?: string;
  title?: string;
};
