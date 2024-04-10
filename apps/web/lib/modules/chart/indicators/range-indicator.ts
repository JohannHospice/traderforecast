import { Indicator, IndicatorResult } from '.';
import { SwingHighIndicator } from './swing-high-indicator';
import { SwingLowIndicator } from './swing-low-indicator';

export class RangeIndicator implements Indicator {
  execute(klines: Kline[]): IndicatorResult {
    const ranges = [];
    const swings = [
      new SwingHighIndicator().execute(klines).markers || [],
      new SwingLowIndicator().execute(klines).markers || [],
    ]
      .flat()
      .sort((a, b) => a.time - +b.time);

    for (let i = 0; i < swings.length; i++) {
      const current = swings[i];

      for (let j = i + 1; j < swings.length; j++) {
        const next = swings[j];

        if (!current.kline?.high || !next.kline?.low) {
          break;
        }

        if (j < swings.length - 1 && swings[j + 1].text === next.text) {
          continue;
        }

        if (
          current.text === 'SH' &&
          next.text === 'SL' &&
          current.kline.high - next.kline.low >
            current.kline.high - current.kline.low
        ) {
          const color = `#${Math.floor(Math.random() * 16777215)
            .toString(16)
            .padStart(6, '0')
            .toUpperCase()}`;

          ranges.push({
            openTime: current.kline.openTime,
            open: current.kline.high,
            closeTime: next.kline.closeTime,
            close: next.kline.low,
            color: color,
            title: 'TR',
          });
          break;
        }
      }
    }

    return {
      rectangles: ranges,
    };
  }
}
