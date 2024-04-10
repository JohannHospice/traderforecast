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

  describe('basic functions', () => {
    class DefaultTrade extends Trade {
      get profitLoss(): number {
        return 0;
      }
      protected shouldSucceed(ohlc: OHLC): boolean {
        return false;
      }
      protected shouldFail(ohlc: OHLC): boolean {
        return false;
      }
    }
    const trade = new DefaultTrade(100);

    test('shouldOpen', () => {
      expect(trade.shouldOpen(ohlc)).toBe(true);
    });

    test('isActive', () => {
      expect(trade.isActive()).toBe(true);
    });

    test('isClosed', () => {
      expect(trade.isClosed()).toBe(false);
    });

    test('isStatus', () => {
      expect(trade.isStatus('await')).toBe(false);
      expect(trade.isStatus('open')).toBe(true);
      expect(trade.isStatus('success')).toBe(false);
    });

    test('cancel', () => {
      trade.cancel();
      expect(trade.isStatus('canceled')).toBe(true);
    });
  });

  describe('update/success', () => {
    class SuccessTrade extends Trade {
      get profitLoss(): number {
        return 0;
      }
      protected shouldSucceed(ohlc: OHLC): boolean {
        return true;
      }
      protected shouldFail(ohlc: OHLC): boolean {
        return false;
      }
    }
    const successTrade = new SuccessTrade(100);

    test('open to success', () => {
      expect(successTrade.isStatus('open')).toBe(true);
      successTrade.update(ohlc);
      expect(successTrade.isStatus('success')).toBe(true);
    });

    test('success is closed', () => {
      expect(successTrade.isClosed()).toBe(true);
    });

    test('success is not active', () => {
      expect(successTrade.isActive()).toBe(false);
    });
  });

  describe('update/fail', () => {
    class FailTrade extends Trade {
      get profitLoss(): number {
        return 0;
      }
      protected shouldSucceed(ohlc: OHLC): boolean {
        return false;
      }
      protected shouldFail(ohlc: OHLC): boolean {
        return true;
      }
    }
    const failTrade = new FailTrade(100);

    test('open to fail', () => {
      expect(failTrade.isStatus('open')).toBe(true);
      failTrade.update(ohlc);
      expect(failTrade.isStatus('fail')).toBe(true);
    });

    test('fail is closed', () => {
      expect(failTrade.isClosed()).toBe(true);
    });

    test('fail is not active', () => {
      expect(failTrade.isActive()).toBe(false);
    });
  });
});
