'use client';
import { Combobox } from '@/components/combobox';
import { MARKER_OPTIONS, MarkerKeys } from '@/lib/hooks/useMarkerDetector';

import { SEARCH_PARAMS } from '@/lib/constants/navigation';
import { useRedirectWithSearchParams } from '@/lib/hooks/useRedirectWithSearchParams';
import { GroupButton } from '@/components/group-button';

export function CardChartHeader({
  onSelectMarker,
  intervals = [],
  valuesMarker = [],
}: {
  intervals?: string[];
  onSelectMarker?: (value: MarkerKeys) => void;
  valuesMarker?: MarkerKeys[];
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
              [SEARCH_PARAMS.START_TIME]: `utc_now-${Number(interval[0]) * EXPECTED_KLINES}${interval[1]}`,
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
        options={MARKER_OPTIONS}
        onSelect={onSelectMarker}
      />
    </div>
  );
}
const EXPECTED_KLINES = 365;
