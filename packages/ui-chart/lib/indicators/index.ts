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
import { TradeIndicator } from './trade-indicator';
import { EngulfingCandlestickMarkersIndicator } from './engulfing-candlestick-indicator';
import { FairValueGapIndicator } from './fair-value-gap-indicator';
import { GapIndicator } from './gap-indicator';
import { ImbalanceIndicator } from './imbalance-indicator';
import { MomemtumCandlestickMarkersIndicator } from './momentum-candlestick-indicator';
import { MultipleCandlestickMarkersIndicator } from './multiple-candlestick-indicator';
import { OrderBlockIndicator } from './order-block-indicator';
import { RangeIndicator } from './range-indicator';
import { SwingHighIndicator } from './swing-high-indicator';
import { SwingLowIndicator } from './swing-low-indicator';
import { UnmitigatedFairValueGapIndicator } from './unmitigated-fair-value-gap-indicator';
import { VolumeInbalanceIndicator } from './volume-inbalance-indicator';

export {
  TradeIndicator,
  EngulfingCandlestickMarkersIndicator,
  FairValueGapIndicator,
  GapIndicator,
  ImbalanceIndicator,
  MomemtumCandlestickMarkersIndicator,
  MultipleCandlestickMarkersIndicator,
  OrderBlockIndicator,
  RangeIndicator,
  SwingHighIndicator,
  SwingLowIndicator,
  UnmitigatedFairValueGapIndicator,
  VolumeInbalanceIndicator,
};
