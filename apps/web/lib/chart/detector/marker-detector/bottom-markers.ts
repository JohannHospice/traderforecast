import { SeriesMarker, Time } from 'lightweight-charts';
import { ChartDetector } from '..';
import { millisecondsToTime } from '../../../helpers/unit';

export class BottomMarkers implements ChartDetector<SeriesMarker<Time>[]> {
  execute(klines: Kline[]): SeriesMarker<Time>[] {
    const bottoms: SeriesMarker<Time>[] = [];

    let min = Number.POSITIVE_INFINITY;

    for (let i = 0; i < klines.length; i++) {
      const kline = klines[i];

      if (kline.low < min) {
        min = kline.low;
        bottoms.push({
          time: millisecondsToTime(kline.closeTime),
          position: 'belowBar',
          color: 'red',
          shape: 'arrowUp',
        });
      }
    }
    return bottoms;
  }
}
