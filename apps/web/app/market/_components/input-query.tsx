'use client';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/helpers/tailwind-utils';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { useEffect, useState } from 'react';

export function InputQuery({
  className,
  onChange,
  defaultValue,
}: {
  className?: string;
  onChange?: (value: string) => void;
  defaultValue?: string | null;
}) {
  const [value, setValue] = useState(defaultValue || '');

  useEffect(() => {
    if (onChange) onChange(value);
  }, [value, onChange]);

  return (
    <div className={cn('relative', className)}>
      <Input
        className='w-full pl-10 min-w-52'
        type='symbol'
        placeholder='Search Currencies...'
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <MagnifyingGlassIcon className='absolute left-0 top-0 m-2.5 h-5 w-5 text-muted-foreground' />
    </div>
  );
}
