'use client';
import { CommandItem } from '@/components/ui/command';
import { CheckIcon } from '@radix-ui/react-icons';
import { cn } from '../lib/tailwind/utils';

export function CommandItemCheck({
  option,
  check,
  onSelect,
  before,
}: {
  check: boolean;
  option: { value: string; label: React.ReactNode };
  onSelect: () => void;
  before?: React.ReactNode;
}) {
  return (
    <CommandItem className='flex cursor-pointer' onSelect={onSelect}>
      {before}
      <span className='overflow-hidden text-nowrap text-ellipsis flex-1 inline-flex gap-2'>
        {option.label}
      </span>
      <CheckIcon
        className={cn('ml-auto h-4 w-4', check ? 'opacity-100' : 'opacity-0')}
      />
    </CommandItem>
  );
}
