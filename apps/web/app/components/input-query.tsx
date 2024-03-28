'use client';
import { SEARCH_PARAMS } from '@/lib/constants/navigation';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { Input, InputProps } from '../../components/ui/input';
import { useEffect, useState } from 'react';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { cn } from '../../lib/tailwind/utils';

export function InputQuery({ className }: { className?: string }) {
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  const [value, setValue] = useState(
    searchParams.get(SEARCH_PARAMS.QUERY) || ''
  );

  const handleSearch = useDebouncedCallback((value) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(SEARCH_PARAMS.QUERY, value);
      params.set(SEARCH_PARAMS.PAGE, '1');
    } else {
      params.delete(SEARCH_PARAMS.QUERY);
      params.delete(SEARCH_PARAMS.PAGE);
    }

    replace(`/?${params.toString()}`);
  }, 300);

  useEffect(() => {
    handleSearch(value);
  }, [value, handleSearch]);

  return (
    <div className={cn('relative', className)}>
      <MagnifyingGlassIcon className='absolute left-0 top-0 m-2.5 h-5 w-5 text-muted-foreground' />
      <Input
        className='w-full pl-10 bg-card min-w-52'
        type='symbol'
        placeholder='Search Currencies...'
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
}
