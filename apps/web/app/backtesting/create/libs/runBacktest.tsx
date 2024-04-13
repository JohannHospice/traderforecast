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

  const strategy = createStrategy(strategyKey, {
    symbol,
    options: {
      startHour: 9,
      endHour: 17,
      takeProfitRatio: 2,
      stopLossMargin: 0.05,
    },
  });

  const backtester = new Backtester(
    symbol,
    strategy,
    BacktestApiMarket,
    walletAmount
  );

  await backtester.run(timeframe);

  return backtester;
}