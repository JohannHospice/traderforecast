import { Indicator, IndicatorResult, Marker } from '.';
import { CandlestickPattern } from '../patterns/candlestick-pattern';

export class EngulfingCandlestickMarkersIndicator implements Indicator {
  execute(klines: Kline[]): IndicatorResult {
    const markers: Marker[] = [];

    for (let i = 1; i < klines.length; i++) {
      const current = new CandlestickPattern(klines[i]);
      const previous = klines[i - 1];

      if (current.isBullishEngulfing(previous)) {
        markers.push({
          time: current.closeTime,
          color: 'green',
          position: 'belowBar',
          shape: 'arrowUp',
          text: 'E',
        });
      }

      if (current.isBearishEngulfing(previous)) {
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
