import { Indicator, IndicatorResult, Marker } from '.';

export class TopMarkersIndicator implements Indicator {
  execute(klines: Kline[]): IndicatorResult {
    const markers: Marker[] = [];
    const klineRegionSize = 5;

    for (let i = klineRegionSize; i < klines.length; i++) {
      let isTop = true;

      const part = Math.ceil(klineRegionSize / 2);

      const currentIndex = i - part;

      const current = klines[currentIndex];
      for (let j = -part; j < part; j++) {
        const nextIndex = i + j;
        if (isTop === false) {
          break;
        }
        if (nextIndex === currentIndex) {
          continue;
        }
        const next = klines[nextIndex];

        isTop = current.close > next.close;
      }

      if (isTop) {
        markers.push({
          time: current.closeTime,
          color: 'green',
          position: 'aboveBar',
          shape: 'arrowDown',
        });
      }
    }

    return {
      markers: markers,
    };
  }
}
