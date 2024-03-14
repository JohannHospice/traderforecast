'use client';
import { Combobox } from '@/components/combobox';
import {
  SerieApplierOptions,
  SerieApplierKeys,
} from '@/lib/constants/serie-applier';

import { SEARCH_PARAMS } from '@/lib/constants/navigation';
import { useRedirectWithSearchParams } from '@/lib/hooks/useRedirectWithSearchParams';
import { GroupButton } from '@/components/group-button';

export function CardChartHeader({
  onSelectMarker,
  intervals = [],
  valuesMarker = [],
}: {
  intervals?: string[];
  onSelectMarker?: (value: SerieApplierKeys) => void;
  valuesMarker?: SerieApplierKeys[];
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
              [SEARCH_PARAMS.START_TIME]: formatInterval(interval, 365),
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
        options={SerieApplierOptions}
        onSelect={onSelectMarker}
      />
    </div>
  );
}

function formatInterval(interval: string, expectedKlines: number): string {
  return `utc_now-${Number(interval[0]) * expectedKlines}${interval[1]}`;
}
