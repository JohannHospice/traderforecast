import { Symbol, TimePeriod } from '@/lib/modules/backtest';
import { Backtester } from '@/lib/modules/backtest/backtester';
import { BacktestApiMarket } from '@/lib/modules/backtest/market/backtest-api-market';
import { createStrategy } from '../../../apps/web/lib/constants/strategy';
import { BacktestingSettingsSchemaType } from '../../../apps/web/lib/validation/backtest-form';

export async function runBacktest(
  {
    pair,
    timePeriod,
    startDate,
    endDate,
    strategyKey,
    walletAmount,
  }: BacktestingSettingsSchemaType,
  settings: any
) {
  const strategy = createStrategy(
    strategyKey,
    {
      key: pair,
      timeperiod: timePeriod as TimePeriod,
    },
    settings
  );

  const backtester = new Backtester(strategy, BacktestApiMarket, walletAmount);

  await backtester.run({
    from: new Date(startDate).getTime(),
    to: new Date(endDate).getTime(),
  });

  return backtester;
}
