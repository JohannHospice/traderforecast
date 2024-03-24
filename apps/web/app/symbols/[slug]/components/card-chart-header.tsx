'use client';
import { Combobox } from '@/components/combobox';
import { IndicatorOptions, IndicatorKeys } from '@/lib/constants/indicator';

import { SEARCH_PARAMS } from '@/lib/constants/navigation';
import { useRedirectWithSearchParams } from '@/lib/hooks/useRedirectWithSearchParams';
import { GroupButton } from '@/components/group-button';
import { formatInterval } from '../../../../lib/helpers/utc';
import { getNumberOfKlinesResponsive } from '../../../../lib/helpers/klines';

export function CardChartHeader({
  onSelectMarker,
  intervals = [],
  valuesMarker = [],
}: {
  intervals?: string[];
  onSelectMarker?: (value: IndicatorKeys) => void;
  valuesMarker?: IndicatorKeys[];
}) {
  const { redirectWithSearchParams, searchParams } =
    useRedirectWithSearchParams();

  return (
    <div className='flex gap-4 flex-wrap'>
      <GroupButton
        defaultValue={searchParams.get(SEARCH_PARAMS.INTERVAL)}
        tabs={intervals.map((interval, i) => ({
          value: interval,
          label: interval.toUpperCase(),
          onClick: () => {
            redirectWithSearchParams(
              {
                [SEARCH_PARAMS.START_TIME]: formatInterval(
                  interval,
                  getNumberOfKlinesResponsive()
                ),
                [SEARCH_PARAMS.INTERVAL]: interval,
              },
              {
                scroll: false,
              }
            );
          },
        }))}
      />
      <Combobox
        className='w-full sm:max-w-44 sm:min-w-60'
        placeholder='Select markers...'
        search='Search markers...'
        noOptions='No markers found.'
        values={valuesMarker}
        options={IndicatorOptions}
        onSelect={onSelectMarker}
        multiple
      />
    </div>
  );
}
