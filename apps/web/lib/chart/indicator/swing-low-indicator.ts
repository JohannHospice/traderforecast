import { Indicator, IndicatorResult, Marker } from '.';

export class SwingLowIndicator implements Indicator {
  execute(klines: Kline[]): IndicatorResult {
    const bottoms: Marker[] = [];

    for (let i = 1; i < klines.length - 1; i++) {
      const previous = klines[i - 1];
      const current = klines[i];
      const next = klines[i + 1];

      if (current.low < previous.low && current.low < next.low) {
        bottoms.push({
          time: current.closeTime,
          color: 'blue',
          position: 'belowBar',
          shape: 'arrowUp',
          text: 'SL',
          kline: current,
        });
      }
    }
    return {
      markers: bottoms,
    };
  }
}
