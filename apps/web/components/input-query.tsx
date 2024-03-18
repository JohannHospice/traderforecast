'use client';
import { SEARCH_PARAMS } from '@/lib/constants/navigation';
import { useRedirectWithSearchParams } from '@/lib/hooks/useRedirectWithSearchParams';
import { Input } from './ui/input';

export function InputQuery() {
  const { redirectWithSearchParams, searchParams } =
    useRedirectWithSearchParams();

  return (
    <Input
      className='w-full max-w-[400px] pl-8'
      type='symbol'
      placeholder='Search'
      defaultValue={searchParams.get(SEARCH_PARAMS.QUERY) || ''}
      onChange={(e) => {
        redirectWithSearchParams(
          {
            [SEARCH_PARAMS.QUERY]: e.target.value,
          },
          {
            href: '/',
          }
        );
      }}
    />
  );
}
