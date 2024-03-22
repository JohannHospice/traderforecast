import { Indicator, IndicatorResult, Marker } from '.';

export class MultipleCandlestickMarkersIndicator implements Indicator {
  execute(klines: Kline[]): IndicatorResult {
    const markers: Marker[] = [];

    for (let i = 2; i < klines.length; i++) {
      const next = klines[i];
      const current = klines[i - 1];
      const previous = klines[i - 2];
    }
    // TODO

    return {
      markers,
    };
  }
}
