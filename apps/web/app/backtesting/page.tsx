'use client';

import { Container } from '@/components/container';
import { Heading } from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Rabbit, Rocket } from 'lucide-react';
import * as React from 'react';
import {
  CardWrapper,
  SelectStrategyLabel,
  SettingCard,
} from './components/setting-card';
import { Button } from '../../components/ui/button';
import { Droplets } from 'lucide-react';
import {
  ControlledInput,
  ControlledSelect,
  ControlledSlider,
} from './components/controlled-field';
import { format } from 'date-fns';

/**
 * The backtesting page offer to the user the execution of multiple strategies and results of those strategies.
 * The user have to enter some parameters:
 * - The strategy to backtest
 * - The start and end date to backtest
 * - The time period(s) to backtest multiple periods can be selected (1m, 5m, 15m, 30m, 1h, 4h, 1d, 1w)
 * - The symbol to backtest
 * - The amount of money to backtest in the wallet
 *
 */
export default function Page() {
  const strategies = [
    {
      value: 'fvg-in-fvg',
      icon: Rabbit,
      title: 'Fair Value Gap',
      titleBold: 'In Fair Value Gap',
      description: 'Our first and most popular strategy.',
    },
    {
      value: 'order-blocks',
      icon: Droplets,
      title: 'Order ',
      titleBold: 'Blocks',
      description: 'Trade on bullish order blocks.',
    },
  ];

  return (
    <>
      <Heading
        title='Backtesting'
        subtitle="Here's the backtesting page, where you can test your strategies."
      />
      <Container fluid className='flex-1'>
        <div className='flex flex-1 flex-col md:flex-row gap-4'>
          <div className='sm:mt-0 mt-8 flex-1 gap-2 flex flex-col md:max-w-[360px]'>
            <CardWrapper title='Strategy'>
              <ControlledSelect
                title='Strategy'
                placeholder='Select a strategy'
                options={strategies.map((strategy) => ({
                  value: strategy.value,
                  label: (
                    <SelectStrategyLabel
                      key={strategy.value}
                      icon={strategy.icon}
                      title={strategy.title}
                      titleBold={strategy.titleBold}
                      description={strategy.description}
                    />
                  ),
                }))}
              />
              <ControlledInput
                label='Wallet'
                type='number'
                placeholder='1000'
              />
            </CardWrapper>
            <CardWrapper title='Target'>
              <ControlledSelect
                title='Pair'
                placeholder='Select a symbol'
                options={[
                  { value: 'BTC', label: 'BTC/USD' },
                  { value: 'ETH', label: 'ETH/USD' },
                  { value: 'BNB', label: 'BNB/USD' },
                  { value: 'CRO', label: 'CRO/USD' },
                ]}
              />
              <ControlledSlider
                title='Initial Time Period'
                options={['1m', '5m', '15m', '30m', '1h', '4h', '1d', '1w']}
                defaultValue={5}
              />

              <ControlledInput
                label='Start Date'
                type='datetime-local'
                placeholder='2021-01-01'
              />
              <ControlledInput
                label='End Date'
                type='datetime-local'
                // local format date time
                value={format(new Date(), "yyyy-MM-dd'T'HH:mm")}
                disabled
              />
            </CardWrapper>
          </div>
          <Card
            noBorder
            className='relative flex-[2] flex min-h-[60vh] flex-col'
          >
            <div className='flex-1' />
            <div className='absolute inset-0 flex justify-center items-center'>
              <Button disabled>
                Run
                <Rocket className='size-5 ml-2' />
              </Button>
            </div>
          </Card>
        </div>
      </Container>
    </>
  );
}
