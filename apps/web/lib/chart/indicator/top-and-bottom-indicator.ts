import { Indicator, IndicatorResult, Marker } from '.';

export class TopAndBottomIndicator implements Indicator {
  execute(klines: Kline[]): IndicatorResult {
    const markers: Marker[] = [];

    const significatKlines = [klines[0]];

    for (let i = 1; i < klines.length - 1; i++) {
      const current = klines[i];
      const previous = significatKlines[significatKlines.length - 1];

      const isHigh = current.high > previous.high;
      const isLow = current.low < previous.low;

      if (isHigh) {
        significatKlines.push(current);
        markers.push({
          time: current.closeTime,
          color: 'green',
          position: 'aboveBar',
          shape: 'arrowDown',
        });
      }

      if (isLow) {
        significatKlines.push(current);
        markers.push({
          time: current.closeTime,
          color: 'red',
          position: 'belowBar',
          shape: 'arrowUp',
        });
      }
    }

    return { markers };
  }
}
