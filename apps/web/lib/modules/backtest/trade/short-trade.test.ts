import { describe, test, expect } from 'vitest';
import { ShortTrade } from './short-trade';

describe('ShortTrade class', () => {
  const ohlc = {
    openTime: 100,
    closeTime: 200,
    close: 100,
    high: 100,
    low: 100,
    open: 100,
  };

  describe('success', () => {
    const shortTrade = new ShortTrade(100, 50, 150);

    test('shouldSucceed', () => {
      expect(shortTrade.shouldSucceed(ohlc)).toBe(false);
      ohlc.low = 50;
      expect(shortTrade.shouldSucceed(ohlc)).toBe(true);
    });

    test('profitLoss', () => {
      expect(shortTrade.profitLoss).toBe(0);
      shortTrade.update(ohlc);
      expect(shortTrade.profitLoss).toBe(50);
    });
  });

  describe('fail', () => {
    const shortTrade = new ShortTrade(100, 50, 150);

    test('shouldFail', () => {
      expect(shortTrade.shouldFail(ohlc)).toBe(false);
      ohlc.high = 150;
      expect(shortTrade.shouldFail(ohlc)).toBe(true);
    });

    test('profitLoss', () => {
      expect(shortTrade.profitLoss).toBe(0);
      shortTrade.update(ohlc);
      expect(shortTrade.profitLoss).toBe(-50);
    });
  });
});
