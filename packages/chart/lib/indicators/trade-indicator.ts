'use client';
import { Trade, TradeStatus, TradeType } from '@traderforecast/database';
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
      const openTime = trade.entryTime.getTime();

      markers.push({
        time: openTime,
        shape: 'circle',
        position: 'inBar',
        kline: klines.find((kline) => kline.openTime === openTime),
        color: this.isLight ? 'black' : 'white',
        text: trade.type + '[' + trade.status + ']',
      });

      if (trade.status === TradeStatus.CANCELLED) {
        return;
      }

      rectangles.push({
        openTime: openTime,
        open: trade.entry,
        closeTime: trade.exitTime.getTime(),
        close: trade.takeProfit,
        color: 'green',
      });

      if (!trade.stopLoss) {
        console.log('Trade has stop loss', trade);
        return;
      }
      rectangles.push({
        openTime: openTime,
        open: trade.entry,
        closeTime: trade.exitTime.getTime(),
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
