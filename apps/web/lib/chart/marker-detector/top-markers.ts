import { SeriesMarker, Time } from 'lightweight-charts';
import { MarkerDetector } from '.';
import { millisecondsToTime } from '../../helpers/unit';

export class TopMarkers implements MarkerDetector {
  constructor() {}

  execute(klines: Kline[]): SeriesMarker<Time>[] {
    const tops: SeriesMarker<Time>[] = [];
    let max = Number.NEGATIVE_INFINITY;
    for (let i = 0; i < klines.length; i++) {
      const kline = klines[i];
      if (kline.high > max) {
        max = kline.high;
        tops.push({
          time: millisecondsToTime(kline.closeTime),
          position: 'aboveBar',
          color: 'green',
          shape: 'arrowUp',
        });
      }
    }
    return tops;
  }
}
