import { EngulfingCandlestickMarkersIndicator } from '@/lib/modules/chart/indicators/engulfing-candlestick-indicator';
import { MomemtumCandlestickMarkersIndicator } from '@/lib/modules/chart/indicators/momentum-candlestick-indicator';
import { SwingHighIndicator } from '@/lib/modules/chart/indicators/swing-high-indicator';
import { SwingLowIndicator } from '@/lib/modules/chart/indicators/swing-low-indicator';
import { FairValueGapIndicator } from '../modules/chart/indicators/fair-value-gap-indicator';
import { GapIndicator } from '../modules/chart/indicators/gap-indicator';
import { VolumeInbalanceIndicator } from '../modules/chart/indicators/volume-inbalance-indicator';
import { OrderBlockIndicator } from '../modules/chart/indicators/order-block-indicator';
import { UnmitigatedFairValueGapIndicator } from '../modules/chart/indicators/unmitigated-fair-value-gap-indicator';
import { ImbalanceIndicator } from '../modules/chart/indicators/imbalance-indicator';

export type IndicatorKeys = keyof typeof IndicatorValues;

export const IndicatorValues = {
  swinghigh: SwingHighIndicator,
  swinglow: SwingLowIndicator,
  engulfing: EngulfingCandlestickMarkersIndicator,
  momentum: MomemtumCandlestickMarkersIndicator,
  fairvaluegap: FairValueGapIndicator,
  gap: GapIndicator,
  volumeinbalance: VolumeInbalanceIndicator,
  orderblock: OrderBlockIndicator,
  unmitigatedfairvaluegap: UnmitigatedFairValueGapIndicator,
  imbalance: ImbalanceIndicator,
};
