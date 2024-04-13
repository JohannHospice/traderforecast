import { beforeEach, describe, expect, vi, Mock, it } from 'vitest';
import { Symbol, Timeframe } from '.';
import { Backtester } from './backtester';
import { Strategy } from './strategies';
import { Wallet } from './wallet';

describe('Backtester', () => {
  let symbol: Symbol;
  let strategy: Strategy;
  let MarketMock: Mock;
  let initialBalance: number;
  let backtester: Backtester;

  beforeEach(() => {
    symbol = { key: 'symbolKey', timeperiod: '1s' };
    strategy = { name: 'strategyName', onTime: vi.fn() };
    MarketMock = vi.fn(() => ({ getOHLC: vi.fn() }));
    initialBalance = 1000;
    backtester = new Backtester(symbol, strategy, MarketMock, initialBalance);
  });

  it('should create an instance of Backtester', () => {
    expect(backtester).toBeInstanceOf(Backtester);
  });

  it('should run the strategy', async () => {
    const timeframe: Timeframe = { from: 0, to: 1000 };
    await backtester.run(timeframe);
    expect(strategy.onTime).toHaveBeenCalled();
  });

  it('should run 10 times the strategy', async () => {
    const timeframe: Timeframe = { from: 0, to: 10000 };
    await backtester.run(timeframe);
    expect(strategy.onTime).toHaveBeenCalledTimes(10);
  });

  it('should update the wallet', async () => {
    const time = 1000;
    await backtester.updateWallet(time);
    expect(MarketMock).toHaveBeenCalled();
  });

  it('should get the wallet', () => {
    const wallet = backtester.getWallet();
    expect(wallet).toBeInstanceOf(Wallet);
  });
});
