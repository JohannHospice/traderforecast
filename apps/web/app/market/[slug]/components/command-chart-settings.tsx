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
import { useChartSettings } from '@/lib/contexts/chart-settings-context';
import { COMMAND_GROUP_INDICATORS } from '../constants/commands';

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
      {COMMAND_GROUP_INDICATORS.map((group, i) => (
        <CommandGroup key={i} heading={group.heading} className='px-7'>
          {group.items.map((indicator) => (
            <CommandItemCheck
              key={indicator.value}
              label={indicator.label}
              disabled={indicator.disabled}
              check={indicators.includes(indicator.value)}
              onSelect={() => toggleIndicator(indicator.value)}
            />
          ))}
        </CommandGroup>
      ))}
    </CommandList>
  );
}
