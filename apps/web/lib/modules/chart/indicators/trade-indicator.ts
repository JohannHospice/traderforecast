'use client';
import { Trade } from '@traderforecast/database';
import { Indicator, IndicatorResult, Rectangle } from '.';

export class TradeIndicator implements Indicator {
  constructor(private trades: Trade[]) {}

  execute(klines: Kline[]): IndicatorResult {
    const rectangles: Rectangle[] = [];
    this.trades.forEach((trade) => {
      if (trade.entryTime && trade.exitTime) {
        rectangles.push({
          openTime: trade.entryTime.getTime(),
          open: trade.entry,
          closeTime: trade.exitTime.getTime(),
          close: trade.takeProfit,
          color: 'green',
        });
        if (trade.stopLoss) {
          rectangles.push({
            openTime: trade.entryTime.getTime(),
            open: trade.entry,
            closeTime: trade.exitTime.getTime(),
            close: trade.stopLoss,
            color: 'red',
          });
        }
      }
    });

    return {
      rectangles,
    };
  }

  setTheme?(isLight: boolean): void {
    // throw new Error('Method not implemented.');
  }
}
