'use client';

import { Combobox } from '@/components/combobox';
import {
  decodeSearchParamList,
  encodeSearchParamList,
} from '@/lib/helpers/string';
import { useRedirectWithSearchParams } from '@/lib/hooks/useRedirectWithSearchParams';
import { useCallback } from 'react';

export function MarketNav({ segments }: { segments: string[] }) {
  const { searchParams, redirectWithSearchParams } =
    useRedirectWithSearchParams();

  const segmentParams = decodeSearchParamList(
    searchParams.get('segments') || ''
  );

  const onSelectSegment = useCallback(
    (valueLowercase: string) => {
      const value = segments.find(
        (segment) => segment.toLowerCase() === valueLowercase
      );
      if (!value) return;

      const segmentParamsUpdated = encodeSearchParamList(
        segmentParams.includes(value)
          ? segmentParams.filter((detector) => detector !== value)
          : [...segmentParams, value]
      );

      redirectWithSearchParams({
        segments: segmentParamsUpdated,
        page: '1',
      });
    },
    [redirectWithSearchParams, segmentParams, segments]
  );

  return (
    <div className='flex flex-1 justify-between flex-wrap gap-4'>
      <Combobox
        placeholder='Select market segment...'
        search='Search market segment...'
        noOptions='No market segment found.'
        multiple
        options={segments
          .sort((a, b) => {
            if (segmentParams.includes(a) && !segmentParams.includes(b)) {
              return -1;
            }
            if (!segmentParams.includes(a) && segmentParams.includes(b)) {
              return 1;
            }
            return a.localeCompare(b);
          })
          .map((segment) => ({
            value: segment.toLowerCase(),
            label: segment,
          }))}
        values={segmentParams.map((segment) => segment.toLowerCase())}
        onSelect={onSelectSegment}
      />
    </div>
  );
}
