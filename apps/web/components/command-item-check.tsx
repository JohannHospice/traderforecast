'use client';
import { CommandItem } from '@/components/ui/command';
import { CheckIcon } from '@radix-ui/react-icons';
import { cn } from '@/lib/tailwind/utils';

export function CommandItemCheck({
  label,
  disabled,
  check,
  onSelect,
}: {
  check: boolean;
  label: React.ReactNode;
  disabled?: boolean;
  onSelect: () => void;
}) {
  return (
    <CommandItem
      disabled={disabled}
      className='flex cursor-pointer'
      onSelect={onSelect}
    >
      <span className='overflow-hidden text-nowrap text-ellipsis flex-1 inline-flex gap-2'>
        {label}
      </span>
      <CheckIcon
        className={cn('ml-auto h-4 w-4', check ? 'opacity-100' : 'opacity-0')}
      />
    </CommandItem>
  );
}
