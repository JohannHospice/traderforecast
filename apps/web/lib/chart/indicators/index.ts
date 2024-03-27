'use client';

export interface Indicator {
  execute(klines: Kline[]): IndicatorResult;
}

export type IndicatorResult = {
  markers?: Marker[];
  priceLines?: PriceLine[];
  rectangles?: Rectangle[];
};

export type Marker = {
  time: number;
  color?: string;
  position?: 'aboveBar' | 'belowBar' | 'inBar';
  shape?: 'circle' | 'square' | 'arrowUp' | 'arrowDown';
  text?: string;
  size?: number;
  kline?: Kline;
};

export type PriceLine = {
  price: number;
  color?: string;
  title?: string;
};

export type Rectangle = {
  openTime: number;
  open: number;
  closeTime: number;
  close: number;
  color?: string;
  title?: string;
};
