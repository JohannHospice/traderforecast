import { Indicator, IndicatorResult, Marker } from '.';
import { BottomIndicator } from './bottom-indicator';
import { TopMarkersIndicator } from './top-indicator';

export class TopAndBottomIndicator implements Indicator {
  execute(klines: Kline[]): IndicatorResult {
    return {
      markers: [
        new TopMarkersIndicator().execute(klines).markers || [],
        new BottomIndicator().execute(klines).markers || [],
      ].flat(),
    };
  }
}
