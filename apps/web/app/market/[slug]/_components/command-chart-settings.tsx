'use client';
import { CommandItemCheck } from '@/components/command-item-check';
import { DotPulse } from '@/components/dot-pulse';
import {
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { COMMAND_GROUP_INDICATORS } from '../../../../lib/constants/indicator-commands';
import { IndicatorCommandLabel } from './indicator-command-label';
import { useChartSettings } from '@traderforecast/ui-chart';

export function CommandChartSettings() {
  const { indicators, live, setLive, toggleIndicator } = useChartSettings();

  return (
    <CommandList className='sm:max-h-full max-h-[300px]'>
      <CommandEmpty>No results found.</CommandEmpty>
      <CommandGroup heading='Settings' className='px-7'>
        <CommandItem
          className='flex gap-2 cursor-pointer'
          onSelect={() => setLive(!live)}
        >
          <span>LIVE</span>
          <DotPulse pulse={live} />
        </CommandItem>
        <CommandItem></CommandItem>
      </CommandGroup>
      <CommandSeparator />
      {COMMAND_GROUP_INDICATORS.map(({ heading, items }, i) => (
        <CommandGroup key={i} heading={heading} className='px-7'>
          {items.map(({ value, short, title, disabled }) => (
            <CommandItemCheck
              key={value}
              label={
                <IndicatorCommandLabel badge={short}>
                  {title}
                </IndicatorCommandLabel>
              }
              disabled={disabled}
              check={indicators.includes(value)}
              onSelect={() => toggleIndicator(value)}
            />
          ))}
        </CommandGroup>
      ))}
    </CommandList>
  );
}
