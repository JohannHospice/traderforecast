'use client';
import { Combobox } from '@/components/combobox';
import { IndicatorOptions, IndicatorKeys } from '@/lib/constants/indicator';

import { SEARCH_PARAMS } from '@/lib/constants/navigation';
import { useRedirectWithSearchParams } from '@/lib/hooks/useRedirectWithSearchParams';
import { GroupButton } from '@/components/group-button';
import {
  formatInterval,
  getNumberOfKlinesResponsive,
} from '../helper/formatInterval';

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
            redirectWithSearchParams({
              [SEARCH_PARAMS.START_TIME]: formatInterval(
                interval,
                getNumberOfKlinesResponsive()
              ),
              [SEARCH_PARAMS.INTERVAL]: interval,
            });
          },
        }))}
      />
      <Combobox
        multiple
        placeholder={'Select markers...'}
        search={'Search markers...'}
        noOptions={'No markers found.'}
        values={valuesMarker}
        options={IndicatorOptions}
        onSelect={onSelectMarker}
      />
    </div>
  );
}
