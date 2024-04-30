import { Trade, TradeStatus } from '@traderforecast/database';
import { Indicator, IndicatorResult, Rectangle, Marker } from '.';

export class TradeIndicator implements Indicator {
  isLight = true;
  constructor(private trades: Trade[]) {}

  execute(klines: Kline[]): IndicatorResult {
    const rectangles: Rectangle[] = [];
    const markers: Marker[] = [];
    this.trades.forEach((trade) => {
      const entryTime =
        (trade.entryTime || trade.exitTime || trade.creationTime)?.getTime() ||
        NaN;
      const exitTime = (trade.exitTime || trade.creationTime)?.getTime() || NaN;

      console.log(entryTime);

      markers.push({
        time: entryTime,
        shape: 'circle',
        position: 'inBar',
        color: this.isLight ? 'black' : 'white',
        text: trade.type + '[' + trade.status + ']',
      });

      rectangles.push({
        openTime: entryTime,
        open: trade.entry,
        closeTime: exitTime,
        close: trade.takeProfit,
        color: 'green',
      });

      if (!trade.stopLoss) {
        console.log('Trade has stop loss', trade);
        return;
      }
      rectangles.push({
        openTime: entryTime,
        open: trade.entry,
        closeTime: exitTime,
        close: trade.stopLoss,
        color: 'red',
      });
    });

    return {
      rectangles,
      markers,
    };
  }

  setTheme?(isLight: boolean): void {
    this.isLight = isLight;
  }
}
