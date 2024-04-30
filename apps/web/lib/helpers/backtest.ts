'use client';
import createBacktest from '@/lib/api/actions/create-backtest';
import { actionGetOHLCs } from '@/lib/api/actions/get-ohlcs';
import { STRATEGY_OPTION_PROPS } from '@/lib/constants/strategy';
import { CreateBacktestAction } from '@/lib/validation/backtest-database';
import { StrategySetting } from '../validation/silver-bullet-setting-form';
import { BacktestingSettingsSchemaType } from '@/lib/validation/backtest-setting-form';
import { BacktestApiMarket, Backtester } from '@traderforecast/trading';
import { TimePeriod } from '@traderforecast/trading/lib';

export async function onBacktest(
  {
    pair,
    timePeriod,
    startDate,
    endDate,
    strategyKey,
    walletAmount,
  }: BacktestingSettingsSchemaType,
  strategySettings?: StrategySetting
) {
  const Strategy = STRATEGY_OPTION_PROPS[strategyKey].strategy;

  if (!Strategy) throw new Error('Invalid strategy key');

  const strategy = new Strategy(
    {
      key: pair,
      timeperiod: timePeriod as TimePeriod,
    },
    strategySettings
  );

  const backtester = new Backtester(strategy, BacktestApiMarket, walletAmount, {
    getOHLCs: actionGetOHLCs,
  });

  await backtester.run({
    from: new Date(startDate).getTime(),
    to: new Date(endDate).getTime(),
  });

  return createBacktest(mapToBacktestAction(backtester));
}

function mapToBacktestAction(backtester: Backtester): CreateBacktestAction {
  const wallet = backtester.getWallet();

  return {
    backtest: {
      finalWalletAmount: wallet.balance,
      initialWalletAmount: wallet.initialBalance,
      timeperiod: backtester.symbol.timeperiod,
      from: new Date(backtester.timeframe?.from || 0),
      to: new Date(backtester.timeframe?.to || 0),
      settings: backtester.strategy.settings,
    },
    trades: backtester.getWallet().trades.map((trade) => ({
      entry: trade.config.entryPrice,
      stopLoss: trade.config.stopLoss,
      takeProfit: trade.config.takeProfit,
      profitLoss: trade.profitLoss,
      creationTime: trade.config.createdTime
        ? new Date(trade.config.createdTime)
        : undefined,
      entryTime: trade.config.entryTime
        ? new Date(trade.config.entryTime)
        : undefined,
      exitTime: trade.ohlcClose?.closeTime
        ? new Date(trade.ohlcClose?.closeTime)
        : undefined,
      status: trade.status,
      symbolId: backtester.symbol.key,
      type: trade.type,
      amount: trade.config.amount,
    })),
    symbol: {
      id: backtester.symbol.key,
    },
    strategy: {
      id: backtester.strategy.id,
      name: backtester.strategy.name,
      settings: backtester.strategy.getSettingsDefinition(),
    },
  };
}
