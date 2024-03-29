import { Indicator, IndicatorResult } from '.';

export class VolumeInbalanceIndicator implements Indicator {
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

      if (current.open < next.close) {
        ranges.push({
          openTime: openTime,
          open: current.open,
          closeTime: closeTime,
          close: next.close,
          color: 'green',
          title: 'VI',
        });
      }

      if (current.close > next.open) {
        ranges.push({
          openTime: openTime,
          open: current.close,
          closeTime: closeTime,
          close: next.open,
          color: 'red',
          title: 'VI',
        });
      }
    }

    return {
      rectangles: ranges,
    };
  }
}
