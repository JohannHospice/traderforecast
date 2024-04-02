import { Indicator, IndicatorResult, Marker, Rectangle, Trendline } from '.';
import { SerieCandlestickPattern } from '../patterns/serie-candlestick-pattern';
import { Color, getColor } from '../../constants/colors';

export class UnmitigatedFairValueGapIndicator implements Indicator {
  isLight: boolean = false;

  setTheme(isLight: boolean) {
    this.isLight = isLight;
  }

  getColor(type: keyof Color) {
    return getColor(this.isLight, type);
  }

  execute(klines: Kline[]): IndicatorResult {
    const rectangles: Rectangle[] = [];
    const markers: Marker[] = [];
    const trendlines: Trendline[] = [];

    const serie = new SerieCandlestickPattern(klines);

    for (
      let fairvaluegap = klines.length - 2;
      fairvaluegap > 1;
      fairvaluegap--
    ) {
      const range = serie.getFairValueGapPriceRange(fairvaluegap);
      if (!range) {
        continue;
      }
      console.log('range', range);

      let retouch = -1;
      for (let j = fairvaluegap + 1; j < serie.length - 1; j++) {
        if (serie.isIncluded(j, range)) {
          retouch = j;
          break;
        }
      }
      if (retouch === -1) {
        rectangles.push({
          openTime: serie.get(fairvaluegap - 1).openTime,
          closeTime: serie.get(
            fairvaluegap + 30 < serie.length
              ? fairvaluegap + 30
              : serie.length - 1
          ).closeTime,
          open: range.high,
          close: range.low,
          color: this.getColor(
            serie.isBullish(fairvaluegap) ? 'bullish' : 'bearish'
          ),
        });
      } else {
        rectangles.push({
          openTime: serie.get(fairvaluegap - 1).openTime,
          closeTime: serie.get(retouch + 1).closeTime,
          open: range.high,
          close: range.low,
          color: this.getColor(
            serie.isBullish(fairvaluegap)
              ? 'bullishDisabled'
              : 'bearishDisabled'
          ),
        });
      }
    }

    return { rectangles, markers, trendlines };
  }
}
