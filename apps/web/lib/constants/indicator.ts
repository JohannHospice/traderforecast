'use client';

import { Indicator } from '@/lib/chart/indicator';
import { BottomIndicator } from '@/lib/chart/indicator/bottom-indicator';
import { EngulfingCandlestickMarkersIndicator } from '@/lib/chart/indicator/engulfing-candlestick-indicator';
import { MomemtumCandlestickMarkersIndicator } from '@/lib/chart/indicator/momentum-candlestick-indicator';
import { MultipleCandlestickMarkersIndicator } from '@/lib/chart/indicator/multiple-candlestick-indicator';
import { ResistanceIndicator } from '@/lib/chart/indicator/resistance-indicator';
import { TopAndBottomIndicator } from '@/lib/chart/indicator/top-and-bottom-indicator';
import { TopMarkersIndicator } from '@/lib/chart/indicator/top-indicator';

export type IndicatorKeys = keyof typeof IndicatorLabels;

export const IndicatorLabels = {
  topbottom: 'Top and Bottom',
  top: 'Top',
  bottom: 'Bottom',
  resistance: 'Resistance',
  engulfing: 'Engulfing Candlestick Pattern',
  momentum: 'Momentum Candlestick Pattern',
  multiple: 'Multiple Candlestick Pattern',
};
export const IndicatorValues = {
  topbottom: TopAndBottomIndicator,
  top: TopMarkersIndicator,
  bottom: BottomIndicator,
  resistance: ResistanceIndicator,
  engulfing: EngulfingCandlestickMarkersIndicator,
  momentum: MomemtumCandlestickMarkersIndicator,
  multiple: MultipleCandlestickMarkersIndicator,
} as Record<IndicatorKeys, new () => Indicator>;

export const IndicatorOptions = Object.keys(IndicatorLabels).map((key) => ({
  value: key as IndicatorKeys,
  label: IndicatorLabels[key as IndicatorKeys],
}));
