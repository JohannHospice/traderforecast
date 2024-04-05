import { Indicator, IndicatorResult } from '.';

export class ImbalanceIndicator implements Indicator {
  execute(klines: Kline[]): IndicatorResult {
    const ranges = [];
    const offsetTimeIndex = 1;
    for (let i = 1; i < klines.length - 1; i++) {
      const prev = klines[i - 1];
      const next = klines[i + 1];

      const openTime = klines[i - 1]?.openTime || 0;
      const closeTime =
        klines[i + offsetTimeIndex]?.closeTime ||
        klines[klines.length - 1].closeTime;

      if (prev.close < next.open) {
        ranges.push({
          openTime: openTime,
          open: prev.high,
          closeTime: closeTime,
          close: next.low,
          color: 'green',
          title: 'FVG',
        });
      }

      if (prev.close > next.open) {
        ranges.push({
          openTime: openTime,
          open: prev.low,
          closeTime: closeTime,
          close: next.high,
          color: 'red',
          title: 'FVG',
        });
      }
    }

    return {
      rectangles: ranges,
    };
  }
}
