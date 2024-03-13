'use client';

import { SEARCH_PARAMS } from '@/app/constants/navigation';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRedirectWithSearchParams } from '@/lib/hooks/useRedirectWithSearchParams';

export function TimeIntervalTabs({ intervals }: { intervals: string[] }) {
  const { redirectWithSearchParams, searchParams } =
    useRedirectWithSearchParams();

  const START_TIMES = intervals.map(
    (interval) =>
      `utc_now-${Number(interval[0]) * EXPECTED_KLINES}${interval[1]}`
  );
  return (
    <Tabs defaultValue={searchParams.get(SEARCH_PARAMS.INTERVAL) || undefined}>
      <TabsList>
        {intervals.map((interval, i) => (
          <TabsTrigger
            key={interval}
            value={interval}
            onClick={() => {
              redirectWithSearchParams({
                [SEARCH_PARAMS.START_TIME]: START_TIMES[i],
                [SEARCH_PARAMS.INTERVAL]: interval,
              });
            }}
          >
            {interval.toUpperCase()}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}

const EXPECTED_KLINES = 365;
