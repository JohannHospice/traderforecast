import { test, expect, describe } from 'vitest';
import { Trade } from '.';
import { OHLC } from '..';

describe('Trade class', () => {
  const ohlc = {
    openTime: 100,
    closeTime: 200,
    close: 100,
    high: 100,
    low: 100,
    open: 100,
  };

  describe('success', () => {
    const longTrade = new Trade({
      entryPrice: 100,
      takeProfit: 150,
      stopLoss: 50,
      entryTime: 100,
    });

    test('shouldSucceed', () => {
      expect(longTrade.hitTakeProfit(ohlc)).toBe(false);
      ohlc.high = 150;
      expect(longTrade.hitTakeProfit(ohlc)).toBe(true);
    });

    test('profitLoss', () => {
      expect(longTrade.profitLoss).toBe(0);
      longTrade.update(ohlc);
      expect(longTrade.profitLoss).toBe(50);
    });

    test('should succeed with a low ahead of the high', () => {
      expect(
        longTrade.hitTakeProfit({
          high: 1000,
          low: 160,
          close: 900,
          open: 500,
          openTime: 100,
          closeTime: 100,
        })
      ).toBe(true);
    });
  });
});
