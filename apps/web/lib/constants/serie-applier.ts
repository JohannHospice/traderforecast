'use client';

import { Indicator } from '@/lib/chart/indicator';
import { BottomIndicator } from '@/lib/chart/indicator/bottom-indicator';
import { EngulfingCandlestickMarkersIndicator } from '@/lib/chart/indicator/engulfing-candlestick-indicator';
import { MomemtumCandlestickMarkersIndicator } from '@/lib/chart/indicator/momentum-candlestick-indicator';
import { MultipleCandlestickMarkersIndicator } from '@/lib/chart/indicator/multiple-candlestick-indicator';
import { ResistanceIndicator } from '@/lib/chart/indicator/resistance-indicator';
import { TopAndBottomIndicator } from '@/lib/chart/indicator/top-and-bottom-indicator';
import { TopMarkersIndicator } from '@/lib/chart/indicator/top-indicator';

export type SerieApplierKeys = keyof typeof SerieApplierKeysSet;

export const SerieApplierKeysSet = {
  topbottom: 'Top and Bottom',
  top: 'Top',
  bottom: 'Bottom',
  resistance: 'Resistance',
  engulfing: 'Engulfing Candlestick Pattern',
  momentum: 'Momentum Candlestick Pattern',
  multiple: 'Multiple Candlestick Pattern',
};
export const Indicators = {
  topbottom: TopAndBottomIndicator,
  top: TopMarkersIndicator,
  bottom: BottomIndicator,
  resistance: ResistanceIndicator,
  engulfing: EngulfingCandlestickMarkersIndicator,
  momentum: MomemtumCandlestickMarkersIndicator,
  multiple: MultipleCandlestickMarkersIndicator,
} as Record<SerieApplierKeys, new () => Indicator>;

export const SerieApplierOptions = Object.keys(SerieApplierKeysSet).map(
  (key) => ({
    value: key as SerieApplierKeys,
    label: SerieApplierKeysSet[key as SerieApplierKeys],
  })
);
