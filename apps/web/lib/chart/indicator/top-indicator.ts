import { Indicator, IndicatorResult, Marker } from '.';

export class TopMarkersIndicator implements Indicator {
  execute(klines: Kline[]): IndicatorResult {
    const markers: Marker[] = [];
    const klineRegionSize = 1;

    for (let i = klineRegionSize; i < klines.length; i++) {
      // const next = klines[i];
      let isTop = true;

      // a value of Math.ceil(klineRegionSize / 2)
      const part = Math.ceil(klineRegionSize / 2);

      const current = klines[i - part];
      for (let j = -part; j < part; j++) {
        if (j === 0) {
          continue;
        }
        if (isTop === false) {
          break;
        }
        const next = klines[i + j];
        console.log(next);

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
