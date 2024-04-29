import { BreakerBlockIndicator } from '../indicators/breaker-block-indicator';
import { EngulfingCandlestickMarkersIndicator } from '../indicators/engulfing-candlestick-indicator';
import { FairValueGapIndicator } from '../indicators/fair-value-gap-indicator';
import { GapIndicator } from '../indicators/gap-indicator';
import { ImbalanceIndicator } from '../indicators/imbalance-indicator';
import { MomemtumCandlestickMarkersIndicator } from '../indicators/momentum-candlestick-indicator';
import { OrderBlockIndicator } from '../indicators/order-block-indicator';
import { SwingHighIndicator } from '../indicators/swing-high-indicator';
import { SwingLowIndicator } from '../indicators/swing-low-indicator';
import { UnmitigatedFairValueGapIndicator } from '../indicators/unmitigated-fair-value-gap-indicator';
import { VolumeInbalanceIndicator } from '../indicators/volume-inbalance-indicator';

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
  breakerblock: BreakerBlockIndicator,
};
