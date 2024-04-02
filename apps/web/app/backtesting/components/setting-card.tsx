import { Button } from '@/components/ui/button';
import * as React from 'react';
import { ControlledSelect, ControlledInput } from './controlled-field';

export function SettingCard({ strategies }: { strategies: any[] }) {
  return (
    <CardWrapper title='Settings'>
      <div className='flex flex-col gap-6'>
        <ControlledSelect
          title='Symbol'
          placeholder='Select a symbol'
          options={[
            { value: 'BTC', label: 'BTC' },
            { value: 'ETH', label: 'ETH' },
            { value: 'BNB', label: 'BNB' },
            { value: 'USDT', label: 'USDT' },
            { value: 'USDC', label: 'USDC' },
            { value: 'BUSD', label: 'BUSD' },
          ]}
        />
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
        <ControlledSelect
          title='Initial Time Period'
          placeholder='Select a time period'
          options={[
            { value: '1m', label: '1m' },
            { value: '5m', label: '5m' },
            { value: '15m', label: '15m' },
            { value: '30m', label: '30m' },
            { value: '1h', label: '1h' },
            { value: '4h', label: '4h' },
            { value: '1d', label: '1d' },
            { value: '1w', label: '1w' },
          ]}
          defaultValue='1d'
        />
        <div className='grid grid-cols-2 gap-4'>
          <ControlledInput
            label='Start Date'
            type='datetime-local'
            placeholder='2021-01-01'
          />
          <ControlledInput
            label='End Date'
            type='datetime-local'
            placeholder='2021-12-31'
          />
        </div>
        <ControlledInput label='Wallet' type='number' placeholder='1000' />
        <Button className='w-full mt-4'>Backtest</Button>
      </div>
    </CardWrapper>
  );
}

function CardWrapper({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <fieldset className='grid gap-6 rounded-lg border p-4 bg-card'>
      <legend className='-ml-1 px-1 text-sm font-medium'>{title}</legend>
      {children}
    </fieldset>
  );
}

function SelectStrategyLabel({
  title,
  titleBold,
  description,
  icon: Icon,
}: {
  title: string;
  titleBold: string;
  description: string;
  icon: React.ExoticComponent<any>;
}) {
  return (
    <div className='flex items-start gap-3 text-muted-foreground'>
      <Icon className='size-5' />
      <div className='grid gap-0.5'>
        <p>
          {title}{' '}
          <span className='font-medium text-foreground'>{titleBold}</span>
        </p>
        <p className='text-xs' data-description>
          {description}
        </p>
      </div>
    </div>
  );
}
