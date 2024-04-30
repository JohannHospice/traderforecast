import { Trade, TradeStatus } from '@traderforecast/database';
import { Indicator, IndicatorResult, Rectangle, Marker } from '.';

export class TradeIndicator implements Indicator {
  isLight = true;
  constructor(private trades: Trade[]) {}

  execute(klines: Kline[]): IndicatorResult {
    const rectangles: Rectangle[] = [];
    const markers: Marker[] = [];
    this.trades.forEach((trade) => {
      if (!trade.entryTime || !trade.exitTime) {
        console.log('Trade has no entry or exit time', trade);
        return;
      }
      const entryTime = trade.entryTime
        ? trade.entryTime.getTime()
        : trade.exitTime.getTime();
      const exitTime = trade.exitTime.getTime();

      markers.push({
        time: entryTime,
        shape: 'circle',
        position: 'inBar',
        kline: klines.find((kline) => kline.openTime === entryTime),
        color: this.isLight ? 'black' : 'white',
        text: trade.type + '[' + trade.status + ']',
      });

      if (trade.status === TradeStatus.CANCELLED) {
        return;
      }

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
