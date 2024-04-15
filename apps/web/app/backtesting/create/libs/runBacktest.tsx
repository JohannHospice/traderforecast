import { Symbol, TimePeriod } from '@/lib/modules/backtest';
import { Backtester } from '@/lib/modules/backtest/backtester';
import { BacktestApiMarket } from '@/lib/modules/backtest/market/backtest-api-market';
import { createStrategy } from './constants';
import { BacktestingSettingsSchemaType } from './constants/schema';

export async function runBacktest({
  pair,
  timePeriod,
  startDate,
  endDate,
  strategyKey,
  walletAmount,
}: BacktestingSettingsSchemaType) {
  const symbol = {
    key: pair,
    timeperiod: timePeriod as TimePeriod,
  } as Symbol;

  const timeframe = {
    from: new Date(startDate).getTime(),
    to: new Date(endDate).getTime(),
  };

  const options = {
    symbol,
    startHour: 9,
    endHour: 17,
    takeProfitRatio: 2,
    stopLossMargin: 0.01,
  };

  const strategy = createStrategy(strategyKey, options);

  const backtester = new Backtester(strategy, BacktestApiMarket, walletAmount);

  await backtester.run(timeframe);

  return backtester;
}
