import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Rabbit } from 'lucide-react';
import { Container } from '../../components/container';
import { Heading } from '../../components/heading';
import { Card } from '../../components/ui/card';

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
  ];

  return (
    <>
      <Heading
        title='Backtesting'
        subtitle="Here's the backtesting page, where you can test your strategies."
      />
      <Container fluid className='flex-1 flex-col md:flex-row '>
        <form action=''>
          <SettingCard strategies={strategies} />
        </form>
        <Card className='relative flex-1 flex min-h-[50vh] flex-col rounded-xl bg-muted/50 p-4'>
          <Badge variant='outline' className='absolute right-3 top-3'>
            Output
          </Badge>
          <div className='flex-1' />
        </Card>
      </Container>
    </>
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
function SettingCard({ strategies }) {
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
                value={strategy.value}
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
      </div>
    </CardWrapper>
  );
}

function ControlledSelect({
  title,
  placeholder,
  options,
  defaultValue,
}: {
  title: string;
  placeholder: string;
  options: { value: string; label: React.ReactNode }[];
  defaultValue?: string;
}) {
  return (
    <div className='grid gap-3'>
      <Label htmlFor={title}>{title}</Label>
      <Select defaultValue={defaultValue}>
        <SelectTrigger className='items-start [&_[data-description]]:hidden'>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function ControlledInput({
  label,
  placeholder,
  type,
}: {
  label: string;
  placeholder: string;
  type: React.HTMLInputTypeAttribute;
}) {
  return (
    <div className='grid gap-3'>
      <Label htmlFor={label}>{label}</Label>
      <Input id={label} type={type} placeholder={placeholder} />
    </div>
  );
}

function ControlledTextarea({
  title,
  placeholder,
}: {
  title: string;
  placeholder: string;
}) {
  return (
    <div className='grid gap-3'>
      <Label htmlFor={title}>{title}</Label>
      <Textarea
        id={title}
        placeholder={placeholder}
        className='min-h-[9.5rem]'
      />
    </div>
  );
}

import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import * as React from 'react';

import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '../../lib/tailwind/utils';

export function DatePicker({
  date,
  onSelect,
}: {
  date?: Date;
  onSelect: (date?: Date) => void;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-[280px] justify-start text-left font-normal',
            !date && 'text-muted-foreground'
          )}
        >
          <CalendarIcon className='mr-2 h-4 w-4' />
          {date ? format(date, 'PPP') : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0'>
        <Calendar
          mode='single'
          selected={date}
          onSelect={onSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
