import { describe, test, expect, vi } from 'vitest';

import { Wallet } from './wallet';
import { OHLC } from '.';
import { LongTrade } from './trade/long-trade';

describe('Wallet class', () => {
  describe('basic functions', () => {
    const ohlc: OHLC = {
      openTime: 100,
      closeTime: 200,
      close: 100,
      high: 100,
      low: 100,
      open: 100,
    };

    const mockTrade = new LongTrade(100, 150);
    const updateSpy = vi.spyOn(mockTrade, 'update');

    const wallet = new Wallet(1000);

    test('addTrade', () => {
      wallet.addTrade(mockTrade);
      expect(wallet.activeTrades).toContain(mockTrade);
    });

    test('updateTrades', () => {
      wallet.updateTrades(ohlc);
      expect(updateSpy).toHaveBeenCalledWith(ohlc);
    });
  });

  describe('trade activity', () => {
    const wallet = new Wallet(1000);

    const cancelTrade = new LongTrade(100, 150);
    const activeTrade = new LongTrade(100, 150);
    wallet.addTrade(cancelTrade);
    wallet.addTrade(activeTrade);

    test('should have two active trades', () => {
      expect(wallet.activeTrades).toContain(cancelTrade);
      expect(wallet.activeTrades).toContain(activeTrade);
    });
    test('should have no closed trade', () => {
      expect(wallet.closedTrades).not.toContain(cancelTrade);
      expect(wallet.closedTrades).not.toContain(activeTrade);
    });

    test('should cancel trade', () => {
      const cancelSpy = vi.spyOn(cancelTrade, 'cancel');
      wallet.cancelTrade(cancelTrade);
      expect(cancelSpy).toHaveBeenCalled();
    });

    test('should have one active trade', () => {
      expect(wallet.activeTrades).toContain(activeTrade);
      expect(wallet.activeTrades).not.toContain(cancelTrade);
    });

    test('should have one closed trade', () => {
      expect(wallet.closedTrades).toContain(cancelTrade);
    });
  });

  describe('balance', () => {
    test('should have balance of 1000', () => {
      const wallet = new Wallet(1000);
      expect(wallet.balance).toBe(1000);
    });

    test('should increase balance by 100', () => {
      const wallet = new Wallet(1000);
      wallet.addTrade(new LongTrade(100, 200));
      wallet.updateTrades({
        open: 100,
        high: 200,
        low: 100,
        close: 200,
        openTime: 100,
        closeTime: 200,
      });
      expect(wallet.balance).toBe(1100);
    });

    test('should decrease balance by 200', () => {
      const wallet = new Wallet(1000);
      wallet.addTrade(new LongTrade(300, 400, 100));
      wallet.updateTrades({
        open: 300,
        high: 350,
        low: 100,
        close: 200,
        openTime: 100,
        closeTime: 200,
      });
      expect(wallet.balance).toBe(800);
    });

    test('should have balance of 2000 after two trades', () => {
      const wallet = new Wallet(1000);
      wallet.addTrade(new LongTrade(1000, 2000));
      wallet.updateTrades({
        open: 100,
        high: 3000,
        low: 100,
        close: 200,
        openTime: 100,
        closeTime: 200,
      });

      wallet.addTrade(new LongTrade(2000, 3000));
      wallet.updateTrades({
        open: 300,
        high: 3500,
        low: 100,
        close: 200,
        openTime: 100,
        closeTime: 200,
      });

      expect(wallet.balance).toBe(3000);
    });
  });
});
