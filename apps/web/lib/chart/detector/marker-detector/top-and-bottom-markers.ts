import { SeriesMarker, Time } from 'lightweight-charts';
import { millisecondsToTime } from '../../../helpers/unit';
import { ChartDetector } from '..';

export class TopAndBottomMarkers
  implements ChartDetector<SeriesMarker<Time>[]>
{
  constructor() {}

  execute(klines: Kline[]): SeriesMarker<Time>[] {
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
          time: millisecondsToTime(current.openTime),
          position: 'aboveBar',
          color: 'green',
          shape: 'arrowDown',
        });
      }

      if (isLow) {
        significatKlines.push(current);
        markers.push({
          time: millisecondsToTime(current.openTime),
          position: 'belowBar',
          color: 'red',
          shape: 'arrowUp',
        });
      }
    }

    return markers;
  }
}
