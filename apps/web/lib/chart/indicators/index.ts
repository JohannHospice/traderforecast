'use client';

export interface Indicator {
  execute(klines: Kline[]): IndicatorResult;
  setTheme?(isLight: boolean): void;
}

export type IndicatorResult = {
  markers?: Marker[];
  priceLines?: PriceLine[];
  rectangles?: Rectangle[];
  trendlines?: Trendline[];
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

export type Trendline = {
  openTime: number;
  open: number;
  closeTime: number;
  close: number;
  color?: string;
};
