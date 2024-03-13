import { SeriesMarker, Time, UTCTimestamp } from 'lightweight-charts';

export function findTopsAndBottoms(klines: Kline[]) {
  const markers: SeriesMarker<Time>[] = [];
  const significatKlines = [klines[0]];

  for (let i = 1; i < klines.length - 1; i++) {
    const current = klines[i];
    const previous = significatKlines[significatKlines.length - 1];

    const isHigh = current.high > previous.high;
    const isLow = current.low < previous.low;

    if (isHigh) {
      significatKlines.push(current);
      markers.push({
        time: (current.openTime / 1000) as UTCTimestamp,
        position: 'aboveBar',
        color: 'green',
        shape: 'arrowDown',
      });
    }

    if (isLow) {
      significatKlines.push(current);
      markers.push({
        time: (current.openTime / 1000) as UTCTimestamp,
        position: 'belowBar',
        color: 'red',
        shape: 'arrowUp',
      });
    }
  }

  return markers;
}
