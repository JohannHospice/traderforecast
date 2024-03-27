import { Indicator, IndicatorResult, Marker } from '.';
import { CandlestickPattern } from '../patterns/candlestick-pattern';

export class SwingHighIndicator implements Indicator {
  execute(klines: Kline[]): IndicatorResult {
    const swingHighs: Marker[] = [];

    for (let i = 1; i < klines.length - 1; i++) {
      const current = new CandlestickPattern(klines[i]);

      if (current.isSwigHigh(klines[i - 1], klines[i + 1])) {
        swingHighs.push({
          time: current.closeTime,
          color: 'green',
          position: 'aboveBar',
          shape: 'arrowDown',
          text: 'SH',
          kline: current.current,
        });
      }
    }
    return {
      markers: swingHighs,
    };
  }
}
