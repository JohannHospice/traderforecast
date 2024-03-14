import { Indicator, IndicatorResult, Marker } from '.';

export class BottomIndicator implements Indicator {
  execute(klines: Kline[]): IndicatorResult {
    const bottoms: Marker[] = [];

    let min = Number.POSITIVE_INFINITY;

    for (let i = 0; i < klines.length; i++) {
      const kline = klines[i];

      if (kline.low < min) {
        min = kline.low;
        bottoms.push({
          time: kline.closeTime,
          color: 'blue',
          position: 'belowBar',
          shape: 'arrowUp',
        });
      }
    }
    return {
      markers: bottoms,
    };
  }
}
