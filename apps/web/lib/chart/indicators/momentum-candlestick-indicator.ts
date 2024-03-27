import { Indicator, IndicatorResult, Marker } from '.';
import { CandlestickPattern } from '../patterns/candlestick-pattern';
import { SeriePattern } from '../patterns/serie-pattern';

export class MomemtumCandlestickMarkersIndicator implements Indicator {
  execute(klines: Kline[]): IndicatorResult {
    const markers: Marker[] = [];

    for (let i = 1; i < klines.length; i++) {
      const current = new CandlestickPattern(klines[i]);
      const _isMarubozu = current.isMarubozu();

      if (!current.isMomentum(klines[i - 1]) && !_isMarubozu) {
        continue;
      }
      const text = _isMarubozu ? 'Mb' : 'Mo';
      if (
        current.isBullish() &&
        new SeriePattern(klines.slice(i - 50, i)).isSMABullish(50)
      ) {
        markers.push({
          time: current.closeTime,
          color: 'green',
          position: 'belowBar',
          shape: 'arrowUp',
          text,
        });
      }

      if (
        current.isBearish() &&
        new SeriePattern(klines.slice(i - 50, i)).isSMABearish(50)
      ) {
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
