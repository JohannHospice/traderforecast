'use client';

import { ControlledInput } from '@/components/fields/controlled-input';
import { ControlledSelect } from '@/components/fields/controlled-select';
import { ControlledSlider } from '@/components/fields/controlled-slider';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { yupResolver } from '@hookform/resolvers/yup';
import { Rocket } from 'lucide-react';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { optionTimePeriod, strategies } from '../constants';
import {
  BacktestingSettingsSchemaType,
  backtestingSettingsSchema,
} from '../constants/schema';
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

  function onSubmit(data: BacktestingSettingsSchemaType) {
    console.log(data);
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
              name='strategy'
              control={control}
              title='Strategy'
              placeholder='Select a strategy...'
              options={strategies.map((strategy) => ({
                value: strategy.value,
                label: (
                  <StrategyOption
                    icon={strategy.icon}
                    title={strategy.title}
                    titleBold={strategy.titleBold}
                    description={strategy.description}
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
          <div className='flex-1' />
          <div className='absolute inset-0 flex justify-center items-center'>
            <Button onClick={handleSubmit(onSubmit)}>
              Run
              <Rocket className='size-5 ml-2' />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
