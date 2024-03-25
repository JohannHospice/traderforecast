'use client';

import { Indicator } from '@/lib/chart/indicator';
import { SwingLowIndicator } from '@/lib/chart/indicator/swing-low-indicator';
import { EngulfingCandlestickMarkersIndicator } from '@/lib/chart/indicator/engulfing-candlestick-indicator';
import { MomemtumCandlestickMarkersIndicator } from '@/lib/chart/indicator/momentum-candlestick-indicator';
import { MultipleCandlestickMarkersIndicator } from '@/lib/chart/indicator/multiple-candlestick-indicator';
import { RangeIndicator } from '@/lib/chart/indicator/range-indicator';
import { SwingHighIndicator } from '@/lib/chart/indicator/swing-high-indicator';

export type IndicatorKeys = keyof typeof IndicatorLabels;

export const IndicatorLabels = {
  swinghigh: 'Swing High (SH)',
  swinglow: 'Swing Low (SL)',
  range: 'Range Indicator (R)',
  engulfing: 'Engulfing Candlestick Pattern (E)',
  momentum: 'Momentum Candlestick Pattern (M)',
  multiple: 'Multiple Candlestick Pattern (Mu)',
};
export const IndicatorValues = {
  swinghigh: SwingHighIndicator,
  swinglow: SwingLowIndicator,
  range: RangeIndicator,
  engulfing: EngulfingCandlestickMarkersIndicator,
  momentum: MomemtumCandlestickMarkersIndicator,
  multiple: MultipleCandlestickMarkersIndicator,
} as Record<IndicatorKeys, new () => Indicator>;

export const IndicatorOptions = Object.keys(IndicatorLabels).map((key) => ({
  value: key as IndicatorKeys,
  label: IndicatorLabels[key as IndicatorKeys],
}));
