import { Indicator, IndicatorResult } from '.';
import { SerieCandlestickPattern } from '@traderforecast/utils/serie-candlestick-pattern';
import { SeriePattern } from '../patterns/serie-pattern';

export class ImbalanceIndicator implements Indicator {
  execute(klines: Kline[]): IndicatorResult {
    const rectangles = [];
    const serie = new SerieCandlestickPattern(klines);
    for (let i = 0; i < serie.length - 2; i++) {
      const current = serie.get(i);
      const next = serie.get(i + 1);

      if (
        serie.isBullish(i) &&
        current.close < next.open &&
        current.close < next.close
      ) {
        rectangles.push({
          openTime: current.openTime,
          open: current.close,
          closeTime: next.closeTime,
          close: serie.isBullish(i + 1) ? next.open : next.close,
          color: 'green',
          title: 'IM',
        });
      }

      if (
        serie.isBearish(i) &&
        current.close > next.open &&
        current.close > next.close
      ) {
        rectangles.push({
          openTime: current.openTime,
          open: current.close,
          closeTime: next.closeTime,
          close: serie.isBearish(i + 1) ? next.open : next.close,
          color: 'red',
          title: 'IM',
        });
      }
    }

    return {
      rectangles,
    };
  }
}
