import { Indicator, IndicatorResult, Marker } from '.';
import { CandlestickPattern } from '../patterns/candlestick-pattern';

export class SwingLowIndicator implements Indicator {
  execute(klines: Kline[]): IndicatorResult {
    const bottoms: Marker[] = [];

    for (let i = 1; i < klines.length - 1; i++) {
      const current = new CandlestickPattern(klines[i]);

      if (current.isSwigLow(klines[i - 1], klines[i + 1])) {
        bottoms.push({
          time: current.closeTime,
          color: 'blue',
          position: 'belowBar',
          shape: 'arrowUp',
          text: 'SL',
          kline: current.current,
        });
      }
    }
    return {
      markers: bottoms,
    };
  }
}
