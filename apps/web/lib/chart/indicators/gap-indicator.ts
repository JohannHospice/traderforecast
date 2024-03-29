import { Indicator, IndicatorResult } from '.';

export class GapIndicator implements Indicator {
  execute(klines: Kline[]): IndicatorResult {
    const ranges = [];
    const offsetTimeIndex = 15;
    for (let i = 0; i < klines.length - 1; i++) {
      const current = klines[i];
      const next = klines[i + 1];

      const openTime = klines[i]?.openTime;
      const closeTime =
        klines[i + offsetTimeIndex]?.closeTime ||
        klines[klines.length - 1].closeTime;

      if (current.high < next.low) {
        ranges.push({
          openTime: openTime,
          open: current.high,
          closeTime: closeTime,
          close: next.low,
          color: 'green',
          title: 'G',
        });
      }

      if (current.low > next.high) {
        ranges.push({
          openTime: openTime,
          open: current.low,
          closeTime: closeTime,
          close: next.high,
          color: 'red',
          title: 'G',
        });
      }
    }

    return {
      rectangles: ranges,
    };
  }
}
