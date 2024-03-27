import { Indicator, IndicatorResult, Marker } from '.';
import { isBullishEngulfing, isBearishEngulfing } from '../pattern-sheet';

export class EngulfingCandlestickMarkersIndicator implements Indicator {
  execute(klines: Kline[]): IndicatorResult {
    const markers: Marker[] = [];

    for (let i = 1; i < klines.length; i++) {
      const current = klines[i];
      const previous = klines[i - 1];

      if (isBullishEngulfing(current, previous)) {
        markers.push({
          time: current.closeTime,
          color: 'green',
          position: 'belowBar',
          shape: 'arrowUp',
          text: 'E',
        });
      }

      if (isBearishEngulfing(current, previous)) {
        markers.push({
          time: current.closeTime,
          color: 'red',
          position: 'aboveBar',
          shape: 'arrowDown',
          text: 'E',
        });
      }
    }

    return {
      markers,
    };
  }
}
