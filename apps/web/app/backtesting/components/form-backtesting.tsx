'use client';

import { ControlledInput } from '@/components/fields/controlled-input';
import { ControlledSelect } from '@/components/fields/controlled-select';
import { ControlledSlider } from '@/components/fields/controlled-slider';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Symbol as BacktestSymbol, TimePeriod } from '@/lib/modules/backtest';
import { Backtester } from '@/lib/modules/backtest/backtester';
import { BacktestApiMarket } from '@/lib/modules/backtest/market/backtest-api-market';
import { Wallet } from '@/lib/modules/backtest/wallet';
import { yupResolver } from '@hookform/resolvers/yup';
import { Rocket, X } from 'lucide-react';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { ICTSilverBulletStrategy } from '../../../lib/modules/backtest/strategies/ict-silver-bullet-strategy';
import {
  STRATEGIES,
  STRATEGY_OPTION_PROPS,
  optionTimePeriod,
} from '../libs/constants';
import {
  BacktestingSettingsSchemaType,
  backtestingSettingsSchema,
} from '../libs/constants/schema';
import { CardWrapper } from './card-wrapper';
import { StrategyOption } from './strategy-option';

export function Backtesting({ symbols }: { symbols: Symbol[] }) {
  const { control, handleSubmit } = useForm({
    mode: 'onChange',
    resolver: yupResolver(backtestingSettingsSchema),
    defaultValues: {
      endDate: new Date(),
      timePeriod: '1h',
    },
  });

  const [wallet, setWallet] = React.useState<Wallet | null>(null);

  async function onSubmit({
    pair,
    timePeriod,
    startDate,
    endDate,
    strategyKey,
    walletAmount,
  }: BacktestingSettingsSchemaType) {
    const Strategy = STRATEGIES[strategyKey] as new (
      symbol: BacktestSymbol,
      config: any
    ) => ICTSilverBulletStrategy;

    const symbol = {
      key: pair,
      timeperiod: timePeriod as TimePeriod,
    } as BacktestSymbol;
    const strategyParams = {
      startHour: 9,
      endHour: 17,
      takeProfitRatio: 2,
      stopLossMargin: 0.05,
    };

    const strategy = new Strategy(symbol, strategyParams);

    const backtester = new Backtester(
      symbol,
      strategy,
      BacktestApiMarket,
      walletAmount
    );

    await backtester.run({
      from: new Date(startDate).getTime(),
      to: new Date(endDate).getTime(),
    });

    setWallet(backtester.getWallet());
  }

  const options = React.useMemo(
    () =>
      symbols.map(({ slug, ticker }) => ({
        value: slug,
        label: ticker,
      })),
    [symbols]
  );

  return (
    <div className='flex flex-1 flex-col md:flex-row gap-4 divide-y-[1px] sm:divide-y-0'>
      <div className='sm:mt-0 mt-8 md:flex-1 flex-none gap-2 flex flex-col md:max-w-[380px] divide-y-[1px] sm:divide-y-0'>
        <div>
          <CardWrapper title='Trading Behavior'>
            <ControlledSelect
              name='strategyKey'
              control={control}
              title='Strategy'
              placeholder='Select a strategy...'
              options={Object.keys(STRATEGY_OPTION_PROPS).map((value) => ({
                value,
                label: (
                  <StrategyOption
                    {...STRATEGY_OPTION_PROPS[
                      value as keyof typeof STRATEGY_OPTION_PROPS
                    ]}
                  />
                ),
              }))}
            />
            <ControlledSlider
              name='timePeriod'
              control={control}
              title='Initial Time Period'
              options={optionTimePeriod}
            />
            <ControlledInput
              name='walletAmount'
              control={control}
              label='Wallet'
              type='number'
              placeholder='1000'
            />
          </CardWrapper>
        </div>
        <div>
          <CardWrapper title='Market Target'>
            <ControlledSelect
              name='pair'
              control={control}
              title='Pair'
              placeholder='Select a symbol...'
              options={options}
            />
            <ControlledInput
              name='startDate'
              control={control}
              label='Start Date'
              type='datetime-local'
              placeholder='2021-01-01'
            />
            <ControlledInput
              name='endDate'
              control={control}
              label='End Date'
              type='datetime-local'
              disabled
            />
          </CardWrapper>
        </div>
      </div>
      <div className='flex flex-1'>
        <Card
          noBorder
          className='relative flex-[2] flex sm:min-h-[60vh] flex-col min-h-20'
        >
          <CardContent className=' flex flex-row flex-1 pt-6 sm:pt-8'>
            {wallet ? (
              <div className='relative flex-1'>
                <pre className='flex-1 text-sm'>
                  {JSON.stringify(
                    {
                      balance: wallet.balance,
                      initialBalance: wallet.initialBalance,
                      tradeCount: wallet.trades.length,
                      trades: wallet.trades.map((trade: any) => ({
                        type: trade.type,
                        status: trade.status,
                        entryPrice: trade.entryPrice,
                        takeProfitPrice: trade.takeProfitPrice,
                        stopLossPrice: trade.stopLossPrice,
                        profitLoss: trade.profitLoss,
                      })),
                    },
                    null,
                    2
                  )}
                </pre>
                <div className='top-0 right-0 absolute'>
                  <Button
                    variant='destructive'
                    size='icon'
                    onClick={() => {
                      setWallet(null);
                    }}
                  >
                    <X />
                  </Button>
                </div>
              </div>
            ) : (
              <div className='absolute inset-0 flex justify-center items-center'>
                <Button onClick={handleSubmit(onSubmit)}>
                  Run
                  <Rocket className='size-5 ml-2' />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
