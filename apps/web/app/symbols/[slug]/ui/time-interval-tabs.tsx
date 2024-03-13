'use client';

import { SEARCH_PARAMS } from '@/lib/constants/navigation';
import { useRedirectWithSearchParams } from '@/lib/hooks/useRedirectWithSearchParams';
import { GroupButton } from '../../../../components/group-button';

export function TimeIntervalTabs({ intervals }: { intervals: string[] }) {
  const { redirectWithSearchParams, searchParams } =
    useRedirectWithSearchParams();

  return (
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
  );
}

const EXPECTED_KLINES = 365;
