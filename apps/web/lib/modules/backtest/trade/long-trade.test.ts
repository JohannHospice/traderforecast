import { describe, test, expect } from 'vitest';
import { LongTrade } from './long-trade';

describe('LongTrade class', () => {
  const ohlc = {
    openTime: 100,
    closeTime: 200,
    close: 100,
    high: 100,
    low: 100,
    open: 100,
  };

  describe('success', () => {
    const longTrade = new LongTrade(100, 150, 50);

    test('shouldSucceed', () => {
      expect(longTrade.shouldSucceed(ohlc)).toBe(false);
      ohlc.high = 150;
      expect(longTrade.shouldSucceed(ohlc)).toBe(true);
    });

    test('profitLoss', () => {
      expect(longTrade.profitLoss).toBe(0);
      longTrade.update(ohlc);
      expect(longTrade.profitLoss).toBe(50);
    });
  });

  describe('fail', () => {
    const longTrade = new LongTrade(100, 150, 50);

    test('shouldFail', () => {
      expect(longTrade.shouldFail(ohlc)).toBe(false);
      ohlc.low = 50;
      expect(longTrade.shouldFail(ohlc)).toBe(true);
    });

    test('profitLoss', () => {
      expect(longTrade.profitLoss).toBe(0);
      longTrade.update(ohlc);
      expect(longTrade.profitLoss).toBe(-50);
    });
  });
});
