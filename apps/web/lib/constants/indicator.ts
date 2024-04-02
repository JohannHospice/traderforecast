import { EngulfingCandlestickMarkersIndicator } from '@/lib/chart/indicators/engulfing-candlestick-indicator';
import { MomemtumCandlestickMarkersIndicator } from '@/lib/chart/indicators/momentum-candlestick-indicator';
import { RangeIndicator } from '@/lib/chart/indicators/range-indicator';
import { SwingHighIndicator } from '@/lib/chart/indicators/swing-high-indicator';
import { SwingLowIndicator } from '@/lib/chart/indicators/swing-low-indicator';
import { FairValueGapIndicator } from '../chart/indicators/fair-value-gap-indicator';
import { GapIndicator } from '../chart/indicators/gap-indicator';
import { VolumeInbalanceIndicator } from '../chart/indicators/volume-inbalance-indicator';
import { OrderBlockIndicator } from '../chart/indicators/order-block-indicator';
import { UnmitigatedFairValueGapIndicator } from '../chart/indicators/unmitigated-fair-value-gap-indicator';

export type IndicatorKeys = keyof typeof IndicatorValues;

export const IndicatorValues = {
  swinghigh: SwingHighIndicator,
  swinglow: SwingLowIndicator,
  range: RangeIndicator,
  engulfing: EngulfingCandlestickMarkersIndicator,
  momentum: MomemtumCandlestickMarkersIndicator,
  fairvaluegap: FairValueGapIndicator,
  gap: GapIndicator,
  volumeinbalance: VolumeInbalanceIndicator,
  orderblock: OrderBlockIndicator,
  unmitigatedfairvaluegap: UnmitigatedFairValueGapIndicator,
};
