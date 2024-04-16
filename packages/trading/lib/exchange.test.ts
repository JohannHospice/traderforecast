import { Mock, beforeEach, describe, expect, test, vi } from 'vitest';
import { OHLC, Symbol } from '.';
import { Exchange } from './exchange';
import { Wallet } from './wallet';

describe('Exchange', () => {
  let wallet: Wallet;
  let MarketMock: Mock;
  let exchange: Exchange;

  beforeEach(() => {
    wallet = new Wallet();
    MarketMock = vi.fn(() => ({
      key: 'symbolKey',
      timeperiod: '1m',
    }));
    exchange = new Exchange(wallet, MarketMock);
  });

  test('should create an instance of Exchange', () => {
    expect(exchange).toBeInstanceOf(Exchange);
  });

  test('should return the wallet', () => {
    expect(exchange.getWallet()).toBe(wallet);
  });

  test('should update trades', async () => {
    const ohlc: OHLC = {
      open: 1,
      high: 2,
      low: 1,
      close: 2,
      openTime: 1000,
      closeTime: 1000,
    };
    const spy = vi.spyOn(wallet, 'updateTrades');
    await exchange.updateTrades(ohlc);
    expect(spy).toHaveBeenCalledWith(ohlc);
  });

  test('should get market', () => {
    const symbol: Symbol = {
      key: 'symbolKey',
      timeperiod: '1m',
    };
    const market = exchange.getMarket(symbol);
    expect(market).toBeDefined();
    expect(MarketMock).toHaveBeenCalledWith({
      key: symbol.key,
      timeperiod: symbol.timeperiod,
    });
  });

  test('should retreive the same market instance', () => {
    const symbol: Symbol = {
      key: 'symbolKey',
      timeperiod: '1m',
    };
    const market1 = exchange.getMarket(symbol);
    const market2 = exchange.getMarket(symbol);
    expect(market1).toBe(market2);
  });

  test('should create a different market instance', () => {
    const symbol1: Symbol = {
      key: 'symbolKey1',
      timeperiod: '1m',
    };
    const symbol2: Symbol = {
      key: 'symbolKey2',
      timeperiod: '1m',
    };
    const market1 = exchange.getMarket(symbol1);
    const market2 = exchange.getMarket(symbol2);
    expect(market1).not.toBe(market2);
  });
});
