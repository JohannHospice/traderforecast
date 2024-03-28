'use client';
import { SEARCH_PARAMS } from '@/lib/constants/navigation';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { Input } from '../../components/ui/input';
import { useEffect, useState } from 'react';

export function InputQuery() {
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
    <Input
      className='w-full max-w-[400px] pl-8'
      type='symbol'
      placeholder='Search'
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}
