import { Indicator, IndicatorResult, Marker, Rectangle } from '.';
import { CandlestickPattern } from '../patterns/candlestick-pattern';
import { SerieCandlestickPattern } from '../patterns/SerieCandlestickPattern';

export class OrderBlockIndicator implements Indicator {
  execute(klines: Kline[]): IndicatorResult {
    const orderblocks: Rectangle[] = [];
    const markers: Marker[] = [];

    const serie = new SerieCandlestickPattern(klines);
    for (let i = 1; i < klines.length - 2; i++) {
      if (serie.isSwingLow(i)) {
        const id = Math.random().toString(36).substring(2, 4);
        for (let j = i; j < klines.length - 2; j++) {
          if (
            serie.isFairValueGap(j + 1) &&
            serie.isBullish(j + 1) &&
            serie.isBullish(j)
          ) {
            const isDifferentFairValueGap = i !== j;

            // add take profit Marker
            markers.push({
              time: serie.get(i).closeTime,
              kline: serie.get(i),
              position: 'belowBar',
              color: isDifferentFairValueGap ? 'red' : 'green',
              text: 'TP/' + id,
            });

            if (isDifferentFairValueGap) {
              markers.push({
                time: serie.get(j).closeTime,
                kline: serie.get(j),
                position: 'belowBar',
                color: 'green',
                text: 'TP+/' + id,
              });
            }
            // TP zone
            orderblocks.push({
              openTime: serie.get(j - 1).openTime,
              closeTime: serie.get(j + 1).closeTime,
              open: serie.get(j).high,
              close: serie.get(j).low,
              color: 'green',
            });

            // FVG zone
            orderblocks.push({
              openTime: serie.get(j).openTime,
              closeTime: serie.get(j + 2).closeTime,
              open: serie.get(j).high,
              close: serie.get(j + 2).low,
              color: 'purple',
            });
            markers.push({
              time: serie.get(j + 1).closeTime,
              kline: serie.get(j + 1),
              position: 'aboveBar',
              shape: 'arrowDown',
              color: 'purple',
              text: 'FVG/' + id,
            });

            // Break of structure
            for (let k = j - 1; k > 0; k--) {
              if (
                serie.isSwingHigh(k) &&
                serie.get(k).high > serie.get(j).high
              ) {
                markers.push({
                  time: serie.get(k).closeTime,
                  kline: serie.get(k),
                  position: 'aboveBar',
                  shape: 'arrowDown',
                  color: 'green',
                  text: 'BOS/' + id,
                });
                break;
              }
            }

            // for (let y = j + 1; y < klines.length; y++) {
            //   if (
            //     serie.isSwingLow(y) &&
            //     serie.get(y).low < serie.get(j + 2).low
            //   ) {
            //     markers.push({
            //       time: serie.get(j + 2).closeTime,
            //       kline: serie.get(j + 2),
            //       position: 'belowBar',
            //       shape: 'arrowUp',
            //       color: 'purple',
            //       text: 'BOS',
            //     });
            //     break;
            //   }
            // }

            break;
          }

          if (serie.isSwingHigh(j)) {
            break;
          }
        }
      }
    }

    return { rectangles: orderblocks, markers };
  }
}
