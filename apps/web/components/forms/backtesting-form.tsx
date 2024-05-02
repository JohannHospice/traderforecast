'use client';

import { ControlledInput } from '@/components/fields/controlled-input';
import { ControlledSelect } from '@/components/fields/controlled-select';
import { ControlledSlider } from '@/components/fields/controlled-slider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { SelectSeparator } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import {
  STRATEGY_OPTION_PROPS,
  TIME_PERIOD_OPTIONS,
} from '@/lib/constants/strategy';
import {
  BacktestingSettingsSchemaType,
  backtestingSettingsSchema,
} from '@/lib/validation/backtest-setting-form';
import { StrategySetting } from '@/lib/validation/silver-bullet-setting-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import { CircleDollarSign, Loader, Rocket } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo, useRef } from 'react';
import { UseFormHandleSubmit, useForm } from 'react-hook-form';
import { onBacktest } from '../../lib/helpers/backtest';
import { StrategyOption } from '../strategy-option';
import { Symbol } from '@/lib/api/dependancies/market/models/symbol';

export function BacktestingForm({
  symbols,
  defaultValues,
}: {
  symbols: Symbol[];
  defaultValues: Partial<BacktestingSettingsSchemaType>;
}) {
  const router = useRouter();
  const { toast } = useToast();

  const { control, handleSubmit, watch } = useForm({
    mode: 'onChange',
    resolver: yupResolver(backtestingSettingsSchema),
    defaultValues: {
      ...(process.env.NODE_ENV === 'development'
        ? {
            endDate: new Date(),
            timePeriod: '5m',
            walletAmount: 1000,
            pair: symbols[0].slug,
            strategyKey: 'ict-silver-bullet',
            startDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
          }
        : {
            timePeriod: '1h',
            endDate: new Date(),
          }),
      ...(defaultValues as BacktestingSettingsSchemaType),
    },
  });
  const strategyKey = watch('strategyKey');

  const { mutate, isPending } = useMutation({
    mutationKey: ['backtest', 'create'],
    mutationFn: async ({
      backtest,
      settings,
    }: {
      backtest: BacktestingSettingsSchemaType;
      settings?: StrategySetting;
    }) => onBacktest(backtest, settings),
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

  const strategySettingHandleSubmit = useRef<
    UseFormHandleSubmit<StrategySetting>
  >(() => async () => {});

  const onSubmit = useMemo(
    () =>
      handleSubmit((backtest, event) => {
        if (!strategySettingHandleSubmit.current) {
          return mutate({
            backtest,
          });
        }
        const submit = strategySettingHandleSubmit.current((settings) =>
          mutate({
            backtest,
            settings,
          })
        );
        return submit(event);
      }),
    [handleSubmit, strategySettingHandleSubmit, mutate]
  );

  const StrategyForm = useMemo(
    () => STRATEGY_OPTION_PROPS[strategyKey]?.settingsForm,
    [strategyKey]
  );

  return (
    <div className='sm:mt-0 mt-8 md:flex-1 flex-none gap-8 flex flex-col divide-y-[1px] sm:divide-y-0'>
      <Card noBorder>
        <CardContent noHeader className='gap-12 flex flex-col'>
          <div>
            <h4 className='text-xl mb-2'>Create a backtest</h4>
            <p className='text-gray-500'>
              Create a backtest with the settings you want to test.
            </p>
          </div>
          <ControlledSelect
            name='strategyKey'
            control={control}
            title='Strategy'
            placeholder='Select a strategy...'
            options={Object.keys(STRATEGY_OPTION_PROPS).map((value) => ({
              value,
              disabled: STRATEGY_OPTION_PROPS[value].strategy === undefined,
              label: (
                <StrategyOption {...STRATEGY_OPTION_PROPS[value].optionProps} />
              ),
            }))}
            required
            description='The strategy to use for the backtest.'
          />
          <ControlledSelect
            name='pair'
            control={control}
            title='Symbol'
            placeholder='Select a symbol...'
            options={symbols.map(({ slug, name }) => ({
              value: slug,
              label: name,
            }))}
            required
            description='The symbol to use for the backtest.'
          />
          <ControlledSlider
            name='timePeriod'
            control={control}
            title='Initial time period'
            options={TIME_PERIOD_OPTIONS}
            description='Targeted time period to take a trade.'
            className='max-w-96'
          />
          <div className='gap-4 flex flex-col'>
            <div className='flex gap-3 flex-1'>
              <ControlledInput
                name='startDate'
                control={control}
                label='Start date'
                type='datetime-local'
                required
                placeholder='2021-01-01'
                description='Dates to backtest the strategy.'
              />
              <ControlledInput
                name='endDate'
                control={control}
                label='End date'
                type='datetime-local'
                required
              />
            </div>
          </div>
          <SelectSeparator />
          <div>
            <h4 className='text-xl mb-2'>Wallet</h4>
            <p className='text-gray-500'>
              Set the amount of the wallet you want to use for the backtest.
            </p>
          </div>
          <ControlledInput
            name='walletAmount'
            control={control}
            label='Wallet amount'
            type='number'
            placeholder='1000'
            endAdornment={<CircleDollarSign className='size-5' />}
            required
          />
          {StrategyForm && (
            <>
              <SelectSeparator />
              <div>
                <h4 className='text-xl mb-2'>Advanced settings</h4>
                <p className='text-gray-500'>
                  You can customize the strategy settings below.
                </p>
              </div>
              <StrategyForm ref={strategySettingHandleSubmit} />
            </>
          )}
        </CardContent>
        <CardFooter className='justify-end'>
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
        </CardFooter>
      </Card>
    </div>
  );
}
