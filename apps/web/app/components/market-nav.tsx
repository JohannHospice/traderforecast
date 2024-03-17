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
import { useCallback, useEffect } from 'react';

// TODO: refactor view mode implementation potentially bugs here
const DEFAULT_VIEW_MODE = SYMBOL_VIEWS.GRID;

export function MarketNav({ segments }: { segments: string[] }) {
  const { searchParams, redirectWithSearchParams } =
    useRedirectWithSearchParams();

  const segmentValues = formatArrayInSearchParam(
    searchParams.get(SEARCH_PARAMS.SEGMENTS) || ''
  );
  const searchParamViewMode =
    searchParams.get(SEARCH_PARAMS.VIEWS) || DEFAULT_VIEW_MODE;

  useEffect(() => {
    if (searchParamViewMode === '' || searchParamViewMode === null) {
      // default view mode
      redirectWithSearchParams({
        [SEARCH_PARAMS.VIEWS]: DEFAULT_VIEW_MODE,
      });
      return;
    }
    if (searchParamViewMode !== localStorage.getItem(SEARCH_PARAMS.VIEWS)) {
      // sync local storage with url
      redirectWithSearchParams({
        [SEARCH_PARAMS.VIEWS]: searchParamViewMode,
      });
    }
  }, [redirectWithSearchParams, searchParamViewMode]);

  const changeViewMode = useCallback(
    (mode: string) => {
      localStorage.setItem(SEARCH_PARAMS.VIEWS, mode);
      redirectWithSearchParams({
        [SEARCH_PARAMS.VIEWS]: mode,
      });
    },
    [redirectWithSearchParams]
  );

  const onSelectSegment = useCallback(
    (value: string) => {
      redirectWithSearchParams({
        [SEARCH_PARAMS.SEGMENTS]: (segmentValues.includes(value)
          ? segmentValues.filter((detector) => detector !== value)
          : [...segmentValues, value]
        ).join(SEARCH_PARAM_ARRAY_SEPARATOR),
      });
    },
    [redirectWithSearchParams, segmentValues]
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
        values={segmentValues}
        onSelect={onSelectSegment}
      />
      <GroupButton
        defaultValue={searchParamViewMode}
        tabs={[
          {
            value: SYMBOL_VIEWS.TABLE,
            label: <TableIcon className='h-4 w-4' />,
            onClick: () => changeViewMode(SYMBOL_VIEWS.TABLE),
          },
          {
            value: SYMBOL_VIEWS.GRID,
            label: <GridIcon className='h-4 w-4' />,
            onClick: () => changeViewMode(SYMBOL_VIEWS.GRID),
          },
        ]}
      />
    </div>
  );
}
