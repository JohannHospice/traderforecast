'use client';
import {
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { IndicatorKeys } from '@/lib/constants/indicator';
import { CommandItemCheck } from '../../../../components/command-item-check';
import { useChartSettings } from './chart-settings-context';
import { cn } from '../../../../lib/tailwind/utils';
import { useMemo } from 'react';

export function CommandChartSettings() {
  const { indicators, live, setLive, toggleIndicator } = useChartSettings();
  const indicatorOptions = useMemo(
    () =>
      Object.keys(IndicatorLabels).map((key) => ({
        value: key as IndicatorKeys,
        label: IndicatorLabels[key as IndicatorKeys],
      })),
    []
  );
  return (
    <CommandList>
      <CommandEmpty>No results found.</CommandEmpty>
      <CommandGroup heading='Settings' className='px-7'>
        <CommandItem
          className='flex gap-2 cursor-pointer'
          onSelect={() => setLive(!live)}
        >
          <span>LIVE</span>
          <span className='relative flex h-2 w-2'>
            <span
              className={cn(
                'animate-ping absolute hidden h-full w-full rounded-full bg-red-400 opacity-75',
                live && 'inline-flex'
              )}
            ></span>
            <span
              className={cn(
                'relative inline-flex rounded-full h-2 w-2 bg-slate-500',
                live && 'bg-red-500'
              )}
            ></span>
          </span>
        </CommandItem>
        <CommandItem></CommandItem>
      </CommandGroup>
      <CommandSeparator />
      <CommandGroup heading='Indicateurs' className='px-7'>
        {indicatorOptions.map((indicator) => (
          <CommandItemCheck
            key={indicator.value}
            option={indicator}
            check={indicators.includes(indicator.value)}
            onSelect={() => toggleIndicator(indicator.value)}
          />
        ))}
      </CommandGroup>
    </CommandList>
  );
}

export const IndicatorLabels: Record<IndicatorKeys, React.ReactNode> = {
  swinghigh: (
    <>
      <BadgeIndice>SH</BadgeIndice> Swing High
    </>
  ),
  swinglow: (
    <>
      <BadgeIndice>SL</BadgeIndice> Swing Low
    </>
  ),
  engulfing: (
    <>
      <BadgeIndice>E</BadgeIndice> Engulfing Candle
    </>
  ),
  momentum: (
    <>
      <BadgeIndice>M</BadgeIndice> Momentum Candle
    </>
  ),
  range: (
    <>
      <BadgeIndice>R</BadgeIndice> Range Indicator
    </>
  ),
};

function BadgeIndice({ children }: { children: React.ReactNode }) {
  return (
    <span className='flex items-center justify-center border-2 text-xs w-8 rounded-sm'>
      {children}
    </span>
  );
}
