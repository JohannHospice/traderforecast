import { Indicator, IndicatorResult, Marker } from '.';

export class EngulfingCandlestickMarkersIndicator implements Indicator {
  execute(klines: Kline[]): IndicatorResult {
    const markers: Marker[] = [];

    for (let i = 1; i < klines.length; i++) {
      const current = klines[i];
      const previous = klines[i - 1];

      const isBullish = current.close > current.open;

      const isBullishEngulfing =
        isBullish &&
        current.open < previous.close &&
        current.close > previous.open &&
        current.open < previous.open &&
        current.close > previous.close;

      if (isBullishEngulfing) {
        markers.push({
          time: current.closeTime,
          color: 'green',
          position: 'belowBar',
          shape: 'arrowUp',
          text: 'E',
        });
      }

      const isBearishEngulfing =
        !isBullish &&
        current.open > previous.close &&
        current.close < previous.open &&
        current.open > previous.open &&
        current.close < previous.close;

      if (isBearishEngulfing) {
        markers.push({
          time: current.closeTime,
          color: 'red',
          position: 'aboveBar',
          shape: 'arrowDown',
          text: 'E',
        });
      }
    }

    return {
      markers,
    };
  }
}
