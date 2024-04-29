import { Indicator, IndicatorResult, Marker, Rectangle, Trendline } from '.';
import { SerieCandlestickPattern } from '../patterns/serie-candlestick-pattern';

export class BreakerBlockIndicator implements Indicator {
  isLight: boolean = false;

  setTheme(isLight: boolean) {
    this.isLight = isLight;
  }

  execute(klines: Kline[]): IndicatorResult {
    const markers: Marker[] = [];

    const serie = new SerieCandlestickPattern(klines);

    let lastBreakerBlock = 0;
    for (let i = 1; i < klines.length; i++) {
      const breakerBlock = serie.findLastBullishBreakerBlock(
        lastBreakerBlock,
        i
      );
      if (!breakerBlock) {
        continue;
      }

      if (lastBreakerBlock < breakerBlock) {
        lastBreakerBlock = breakerBlock;
      }

      let isBearish = false;
      console.log('BB', breakerBlock, serie.get(breakerBlock));

      markers.push({
        time: serie.get(breakerBlock).closeTime,
        kline: serie.get(breakerBlock),
        text: 'BB',
        color: isBearish ? '#ff0000' : '#00ff00',
        position: isBearish ? 'aboveBar' : 'belowBar',
        shape: isBearish ? 'arrowDown' : 'arrowUp',
      });
    }

    return { markers };
  }
}
