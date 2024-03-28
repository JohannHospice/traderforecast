'use client';

import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';
import { useState } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import { cn } from '@/lib/tailwind/utils';

export function Combobox<T extends string>({
  options: options = [],
  placeholder,
  search,
  noOptions,
  disabled,
  multiple,
  values,
  onSelect,
  className = '',
}: {
  placeholder: string;
  search: string;
  noOptions: string;
  options?: { value: T; label: string }[];
  disabled?: boolean;
  multiple?: boolean;
  values: T[];
  onSelect?: (value: T) => void;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild disabled={disabled}>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className={className + ' justify-between w-[220px]'}
          disabled={disabled}
        >
          <span className='text-ellipsis overflow-hidden'>
            {values.length > 0
              ? values
                  .map(
                    (v) => options.find((option) => option.value === v)?.label
                  )
                  .join(', ')
              : placeholder}
          </span>
          <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[220px] p-0 max-h-[300px] overflow-y-auto'>
        <Command>
          <CommandInput placeholder={search} className='h-9' />
          <CommandEmpty>{noOptions}</CommandEmpty>
          <CommandGroup>
            {options.map((option) => (
              <CommandItem
                key={option.value}
                value={option.value}
                onSelect={(currentValue) => {
                  if (onSelect) {
                    onSelect(currentValue as T);
                  }
                  if (!multiple) {
                    setOpen(false);
                  }
                }}
              >
                {option.label}
                <CheckIcon
                  className={cn(
                    'ml-auto h-4 w-4',
                    values.includes(option.value) ? 'opacity-100' : 'opacity-0'
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
