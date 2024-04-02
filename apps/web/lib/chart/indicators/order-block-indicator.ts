import { Indicator, IndicatorResult, Marker, Rectangle, Trendline } from '.';
import { SerieCandlestickPattern } from '../patterns/serie-candlestick-pattern';

export class OrderBlockIndicator implements Indicator {
  isLight: boolean = false;

  setTheme(isLight: boolean) {
    this.isLight = isLight;
  }

  execute(klines: Kline[]): IndicatorResult {
    const rectangles: Rectangle[] = [];
    const markers: Marker[] = [];
    const trendlines: Trendline[] = [];

    const serie = new SerieCandlestickPattern(klines);

    const breakofstructures: Record<number, number> = {};
    for (
      let breakofstructure = klines.length - 2;
      breakofstructure > 1;
      breakofstructure--
    ) {
      if (!serie.isSwingHigh(breakofstructure)) {
        continue;
      }

      const breakofstructureConfirmation =
        serie.findHigherHigh(breakofstructure);

      if (breakofstructureConfirmation === -1) {
        continue;
      }

      if (breakofstructures[breakofstructureConfirmation]) {
        markers.push({
          time: serie.get(breakofstructure).closeTime,
          kline: serie.get(breakofstructure),
          position: 'aboveBar',
          shape: 'circle',
          color: this.getColor('breakofstructureCanceled'),
        });
        continue;
      }

      const fairValueGap = serie.findFairValueGap(
        breakofstructure,
        breakofstructureConfirmation
      );

      if (fairValueGap === -1) {
        continue;
      }

      const orderblock = fairValueGap - 1;
      breakofstructures[breakofstructureConfirmation] = breakofstructure;

      markers.push({
        time: serie.get(breakofstructure).closeTime,
        kline: serie.get(breakofstructure),
        position: 'aboveBar',
        shape: 'circle',
        color: this.getColor('breakofstructure'),
        text: 'BOS',
      });

      trendlines.push({
        closeTime: serie.get(breakofstructureConfirmation).closeTime,
        openTime: serie.get(breakofstructure).openTime,
        open: serie.get(breakofstructure).high,
        close: serie.get(breakofstructure).high,
        color: this.getColor('breakofstructure'),
      });

      rectangles.push({
        openTime: serie.get(fairValueGap - 1).openTime,
        closeTime: serie.get(fairValueGap + 1).closeTime,
        open: serie.get(fairValueGap - 1).high,
        close: serie.get(fairValueGap + 1).low,
        color: this.getColor('fairValueGap'),
      });

      const entry = serie.findOrderBlockEntry(orderblock);

      if (entry === -1) {
        markers.push({
          time: serie.get(orderblock).closeTime,
          kline: serie.get(orderblock),
          position: 'belowBar',
          shape: 'arrowUp',
          color: this.getColor('entryWaiting'),
          text: 'OB',
        });
        rectangles.push({
          openTime: serie.get(orderblock - 1).openTime,
          closeTime: serie.get(orderblock + 1).closeTime,
          open: serie.get(orderblock).low,
          close: serie.get(orderblock).high,
          color: this.getColor('entryWaiting'),
        });
        continue;
      }
      markers.push({
        time: serie.get(orderblock).closeTime,
        kline: serie.get(orderblock),
        position: 'belowBar',
        shape: 'arrowUp',
        color: this.getColor('entry'),
        text: 'OB',
      });
      rectangles.push({
        openTime: serie.get(orderblock - 1).openTime,
        closeTime: serie.get(entry + 1)?.closeTime,
        open: serie.get(orderblock).low,
        close: serie.get(orderblock).high,
        color: this.getColor('entry'),
      });
      markers.push({
        time: serie.get(entry).closeTime,
        kline: serie.get(entry),
        position: 'belowBar',
        shape: 'arrowUp',
        color: this.getColor('entryPoint'),
        text: 'E',
      });
    }

    return { rectangles, markers, trendlines };
  }

  getColor(type: string) {
    const colors = {
      breakofstructureCanceled: this.isLight
        ? 'rgba(0, 0, 0, .25)'
        : 'rgba(255, 255, 255, .25)',
      breakofstructure: 'orange',
      fairValueGap: 'purple',
      orderblock: 'green',
      entryWaiting: 'grey',
      entry: 'green',
      entryPoint: 'red',
    } as Record<string, string>;

    return colors[type];
  }
}
