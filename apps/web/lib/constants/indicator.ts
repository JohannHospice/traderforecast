import { EngulfingCandlestickMarkersIndicator } from '@/lib/chart/indicators/engulfing-candlestick-indicator';
import { MomemtumCandlestickMarkersIndicator } from '@/lib/chart/indicators/momentum-candlestick-indicator';
import { RangeIndicator } from '@/lib/chart/indicators/range-indicator';
import { SwingHighIndicator } from '@/lib/chart/indicators/swing-high-indicator';
import { SwingLowIndicator } from '@/lib/chart/indicators/swing-low-indicator';

export type IndicatorKeys = keyof typeof IndicatorValues;

export const IndicatorValues = {
  swinghigh: SwingHighIndicator,
  swinglow: SwingLowIndicator,
  range: RangeIndicator,
  engulfing: EngulfingCandlestickMarkersIndicator,
  momentum: MomemtumCandlestickMarkersIndicator,
};
