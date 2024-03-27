import { Indicator, IndicatorResult, Marker } from '.';
import { isSMABearish, isSMABullish, sma } from '../indicator-sheet';
import { isBearish, isBullish, isMarubozu, isMomentum } from '../pattern-sheet';

export class MomemtumCandlestickMarkersIndicator implements Indicator {
  execute(klines: Kline[]): IndicatorResult {
    const markers: Marker[] = [];

    for (let i = 1; i < klines.length; i++) {
      const current = klines[i];
      const previous = klines[i - 1];
      const _isMomentum = isMomentum(current, previous);
      const _isMarubozu = isMarubozu(current);

      if (!_isMomentum && !_isMarubozu) {
        continue;
      }
      const text = _isMarubozu ? 'Mb' : 'Mo';
      if (isBullish(current) && isSMABullish(klines.slice(i - 50, i), 50)) {
        markers.push({
          time: current.closeTime,
          color: 'green',
          position: 'belowBar',
          shape: 'arrowUp',
          text,
        });
      }

      if (isBearish(current) && isSMABearish(klines.slice(i - 50, i), 50)) {
        markers.push({
          time: current.closeTime,
          color: 'red',
          position: 'aboveBar',
          shape: 'arrowDown',
          text,
        });
      }
    }

    return {
      markers,
    };
  }
}
