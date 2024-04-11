import { describe, test, expect, vi, it } from 'vitest';

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
      const wallet = new Wallet(500);
      expect(wallet.balance).toBe(500);
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

  describe('profitLoss', () => {
    it('should have profitLoss of 0', () => {
      const wallet = new Wallet(1000);
      expect(wallet.profitLoss).toBe(0);
    });

    it('should have profitLoss of 100', () => {
      const wallet = new Wallet(1000);
      wallet.addTrade(new LongTrade(68412.1245, 69412.1245));
      wallet.updateTrades({
        open: 100000,
        high: 100000,
        low: 100000,
        close: 100000,
        openTime: 100000,
        closeTime: 100000,
      });
      expect(wallet.profitLoss).toBe(1000);
    });
  });
});
