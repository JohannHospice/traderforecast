import { Indicator, IndicatorResult } from '.';

export class TopMarkersIndicator implements Indicator {
  execute(klines: Kline[]): IndicatorResult {
    const markers = [];
    let max = Number.NEGATIVE_INFINITY;
    for (let i = 0; i < klines.length; i++) {
      const kline = klines[i];
      if (kline.high > max) {
        max = kline.high;
        markers.push({
          time: kline.closeTime,
          color: 'red',
        });
      }
    }
    return { markers };
  }
}
