'use client';

import { useRedirectWithSearchParams } from '@/lib/hooks/useRedirectWithSearchParams';
import { GridIcon, TableIcon } from '@radix-ui/react-icons';
import {
  SEARCH_PARAM_ARRAY_SEPARATOR,
  SEARCH_PARAMS,
  SYMBOL_VIEWS,
} from '@/lib/constants/navigation';
import { GroupButton } from '@/components/group-button';
import { Combobox } from '@/components/combobox';
import { formatArrayInSearchParam } from '@/lib/helpers/string';

export function MarketNav({ segments }: { segments: string[] }) {
  const { searchParams, redirectWithSearchParams } =
    useRedirectWithSearchParams();

  const values = formatArrayInSearchParam(
    searchParams.get(SEARCH_PARAMS.SEGMENTS) || ''
  );

  return (
    <div className='flex flex-1 justify-between flex-wrap gap-4'>
      <Combobox
        placeholder='Select market segment...'
        search='Search market segment...'
        noOptions='No market segment found.'
        multiple
        options={segments.map((segment) => ({
          value: encodeURI(segment.toLowerCase()),
          label: segment,
        }))}
        values={values}
        onSelect={(value) => {
          redirectWithSearchParams({
            [SEARCH_PARAMS.SEGMENTS]: (values.includes(value)
              ? values.filter((detector) => detector !== value)
              : [...values, value]
            ).join(SEARCH_PARAM_ARRAY_SEPARATOR),
          });
        }}
      />
      <GroupButton
        defaultValue={searchParams.get(SEARCH_PARAMS.VIEWS)}
        tabs={[
          {
            value: SYMBOL_VIEWS.TABLE,
            label: <TableIcon className='h-4 w-4' />,
            onClick: () => {
              redirectWithSearchParams({
                [SEARCH_PARAMS.VIEWS]: SYMBOL_VIEWS.TABLE,
              });
            },
          },
          {
            value: SYMBOL_VIEWS.GRID,
            label: <GridIcon className='h-4 w-4' />,
            onClick: () => {
              redirectWithSearchParams({
                [SEARCH_PARAMS.VIEWS]: SYMBOL_VIEWS.GRID,
              });
            },
          },
        ]}
      />
    </div>
  );
}
