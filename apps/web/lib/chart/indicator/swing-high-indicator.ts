import { Indicator, IndicatorResult, Marker } from '.';

export class SwingHighIndicator implements Indicator {
  execute(klines: Kline[]): IndicatorResult {
    const tops: Marker[] = [];

    for (let i = 1; i < klines.length - 1; i++) {
      const current = klines[i];
      const previous = klines[i - 1];
      const next = klines[i + 1];

      if (current.high > previous.high && current.high > next.high) {
        tops.push({
          time: current.closeTime,
          color: 'green',
          position: 'aboveBar',
          shape: 'arrowDown',
          text: 'SH',
          kline: current,
        });
      }
    }
    return {
      markers: tops,
    };
  }
}
