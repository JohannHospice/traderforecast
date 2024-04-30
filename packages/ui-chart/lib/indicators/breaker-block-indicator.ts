import { Indicator, IndicatorResult, Marker, Rectangle, Trendline } from '.';
import { SerieCandlestickPattern } from '@traderforecast/utils/serie-candlestick-pattern';

export class BreakerBlockIndicator implements Indicator {
  isLight: boolean = false;

  setTheme(isLight: boolean) {
    this.isLight = isLight;
  }

  execute(klines: Kline[]): IndicatorResult {
    const markers: Marker[] = [];
    const rectangles: Rectangle[] = [];
    const serie = new SerieCandlestickPattern(klines);
    const breakderBlocks: any[] = [];

    let lastBreakerBlock = 0;
    for (let i = 1; i < klines.length; i++) {
      const data = serie.findLastBreakerBlock(lastBreakerBlock, i);
      if (
        !data ||
        breakderBlocks.some((b) => b.breakerBlock === data.breakerBlock)
      ) {
        continue;
      }
      breakderBlocks.push(data);
      const {
        swingHigh,
        swingLow,
        higherSwingHigh,
        lowerSwingLow,
        breakerBlock,
        isBullish,
      } = data;

      const color = isBullish ? '#00FF00' : '#FF0000';
      markers.push({
        time: serie.get(swingHigh).closeTime,
        kline: serie.get(swingHigh),
        color: color,
        position: 'aboveBar',
        shape: 'arrowDown',
        text: 'SH' + breakerBlock,
      });

      markers.push({
        time: serie.get(swingLow).closeTime,
        kline: serie.get(swingLow),
        color: color,
        position: 'belowBar',
        shape: 'arrowUp',
        text: 'SL' + breakerBlock,
      });

      markers.push({
        time: serie.get(higherSwingHigh).closeTime,
        kline: serie.get(higherSwingHigh),
        color: color,
        position: 'aboveBar',
        shape: 'arrowDown',
        text: 'HH' + breakerBlock,
      });

      markers.push({
        time: serie.get(lowerSwingLow).closeTime,
        kline: serie.get(lowerSwingLow),
        color: color,
        position: 'belowBar',
        shape: 'arrowUp',
        text: 'LL' + breakerBlock,
      });

      rectangles.push({
        open: serie.get(breakerBlock).close,
        close: serie.get(swingLow).low,
        openTime: serie.get(breakerBlock - 1).openTime,
        closeTime: serie.get(
          higherSwingHigh + 10 >= klines.length
            ? higherSwingHigh
            : higherSwingHigh + 10
        ).closeTime,
        color: color,
      });
    }

    return { markers, rectangles };
  }
}
function randomColor() {
  return '#' + Math.floor(Math.random() * 16777215).toString(16);
}
