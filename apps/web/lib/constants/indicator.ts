import { EngulfingCandlestickMarkersIndicator } from '@/lib/chart/indicator/engulfing-candlestick-indicator';
import { MomemtumCandlestickMarkersIndicator } from '@/lib/chart/indicator/momentum-candlestick-indicator';
import { RangeIndicator } from '@/lib/chart/indicator/range-indicator';
import { SwingHighIndicator } from '@/lib/chart/indicator/swing-high-indicator';
import { SwingLowIndicator } from '@/lib/chart/indicator/swing-low-indicator';

export type IndicatorKeys = keyof typeof IndicatorValues;

export const IndicatorValues = {
  swinghigh: SwingHighIndicator,
  swinglow: SwingLowIndicator,
  range: RangeIndicator,
  engulfing: EngulfingCandlestickMarkersIndicator,
  momentum: MomemtumCandlestickMarkersIndicator,
};
