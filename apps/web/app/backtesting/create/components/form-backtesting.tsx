'use client';

import { ControlledInput } from '@/components/fields/controlled-input';
import { ControlledSelect } from '@/components/fields/controlled-select';
import { ControlledSlider } from '@/components/fields/controlled-slider';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Symbol as BacktestSymbol, TimePeriod } from '@/lib/modules/backtest';
import { Backtester } from '@/lib/modules/backtest/backtester';
import { BacktestApiMarket } from '@/lib/modules/backtest/market/backtest-api-market';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import { CircleDollarSign, Loader, Rocket } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import createBacktest from '../actions';
import {
  STRATEGY_OPTION_PROPS,
  createStrategy,
  optionTimePeriod,
} from '../libs/constants';
import {
  BacktestingSettingsSchemaType,
  backtestingSettingsSchema,
} from '../libs/constants/schema';
import { StrategyOption } from './strategy-option';

export function Backtesting({
  symbols,
  defaultValues,
}: {
  symbols: Symbol[];
  defaultValues: Partial<BacktestingSettingsSchemaType>;
}) {
  const router = useRouter();
  const { toast } = useToast();

  const { control, handleSubmit } = useForm({
    mode: 'onChange',
    resolver: yupResolver(backtestingSettingsSchema),
    defaultValues: {
      ...(process.env.NODE_ENV === 'development'
        ? {
            endDate: new Date(),
            timePeriod: '5m',
            walletAmount: 1000,
            pair: symbols[0].slug,
            strategyKey: 'ict-silver-bullet' as any,
            startDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
          }
        : {
            timePeriod: '1h',
          }),
      ...(defaultValues as BacktestingSettingsSchemaType),
    },
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ['backtest', 'create'],
    mutationFn: async (params: BacktestingSettingsSchemaType) => {
      const backtester = await runBacktest(params);

      return createBacktest(backtester.map());
    },
    onSuccess: (backtest) => {
      toast({
        description: 'Your backtest has been created successfully.',
      });
      router.push('/backtesting/' + backtest.id);
    },
    onError: (error, variables) => {
      console.error(error, variables);
      toast({
        title: 'An error occurred while creating the backtest.',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const onSubmit = handleSubmit((data) => mutate(data));

  return (
    <div className='sm:mt-0 mt-8 md:flex-1 flex-none gap-4 flex flex-col divide-y-[1px] sm:divide-y-0'>
      <Card noBorder>
        <CardHeader>
          <CardTitle>Trading Behavior</CardTitle>
        </CardHeader>
        <CardContent>
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
            required
          />
          <ControlledSlider
            name='timePeriod'
            control={control}
            title='Initial time period'
            options={optionTimePeriod}
          />
          <ControlledInput
            name='walletAmount'
            control={control}
            label='Wallet amount'
            type='number'
            placeholder='1000'
            endAdornment={<CircleDollarSign className='size-5' />}
            required
          />
        </CardContent>
      </Card>
      <Card noBorder>
        <CardHeader>
          <CardTitle>Market Target</CardTitle>
        </CardHeader>
        <CardContent>
          <ControlledSelect
            name='pair'
            control={control}
            title='Symbol pair'
            placeholder='Select a symbol...'
            options={symbols.map(({ slug, name }) => ({
              value: slug,
              label: name,
            }))}
            required
          />
          <ControlledInput
            name='startDate'
            control={control}
            label='Start date'
            type='datetime-local'
            required
            placeholder='2021-01-01'
          />
          <ControlledInput
            name='endDate'
            control={control}
            label='End date'
            type='datetime-local'
            disabled
            required
          />
        </CardContent>
        <CardFooter>
          <div className='flex justify-end items-center'>
            <Button
              size='lg'
              onClick={onSubmit}
              disabled={isPending}
              className='gap-2'
            >
              Run
              {isPending ? (
                <Loader className='size-5 animate-spin' />
              ) : (
                <Rocket className='size-5' />
              )}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

async function runBacktest({
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
  } as BacktestSymbol;

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
