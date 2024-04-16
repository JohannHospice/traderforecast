'use client';

import { Combobox } from '@/components/combobox';
import { encodeSearchParamList } from '@/lib/helpers/string';
import { useRedirectParams } from '@/lib/hooks/use-redirect-params';
import { useCallback } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { InputQuery } from './input-query';

export function MarketNav({
  selectedSegments,
  segments,
  slug,
}: {
  segments: string[];
  slug?: string;
  selectedSegments: string[];
}) {
  const { redirectParams } = useRedirectParams();

  const onSelectSegment = useCallback(
    (valueLowercase: string) => {
      const value = segments.find(
        (segment) => segment.toLowerCase() === valueLowercase
      );
      if (!value) return;

      const segmentParamsUpdated = encodeSearchParamList(
        selectedSegments.includes(value)
          ? selectedSegments.filter((detector) => detector !== value)
          : [...selectedSegments, value]
      );

      redirectParams({
        segments: segmentParamsUpdated,
        page: '1',
      });
    },
    [redirectParams, selectedSegments, segments]
  );

  const handleSearch = useDebouncedCallback((value) => {
    redirectParams({
      slug: value,
      page: '1',
    });
  }, 300);

  return (
    <div className='flex-1 flex flex-row flex-wrap gap-4 w-full md:w-[66.66%] lg:w-[50%] xl:w-[40%] pr-2.5 px-4 sm:px-0 mt-4 sm:mt-0'>
      <div className='flex-1 '>
        <InputQuery onChange={handleSearch} defaultValue={slug} />
      </div>
      <div className='flex-1'>
        <Combobox
          className='w-full'
          placeholder='Select market segment...'
          search='Search market segment...'
          noOptions='No market segment found.'
          multiple
          options={segments
            .sort((a, b) => {
              if (
                selectedSegments.includes(a) &&
                !selectedSegments.includes(b)
              ) {
                return -1;
              }
              if (
                !selectedSegments.includes(a) &&
                selectedSegments.includes(b)
              ) {
                return 1;
              }
              return a.localeCompare(b);
            })
            .map((segment) => ({
              value: segment.toLowerCase(),
              label: segment,
            }))}
          values={selectedSegments.map((segment) => segment.toLowerCase())}
          onSelect={onSelectSegment}
        />
      </div>
    </div>
  );
}
