'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRedirectWithSearchParams } from '@/lib/hooks/useRedirectWithSearchParams';
import { SEARCH_PARAMS_SYMBOL } from '../page';

export function IntervalNav({ intervals }: { intervals: string[] }) {
  const { redirectWithSearchParams, searchParams } =
    useRedirectWithSearchParams();

  const START_TIMES = intervals.map(
    (interval) =>
      `utc_now-${Number(interval[0]) * EXPECTED_KLINES}${interval[1]}`
  );
  return (
    <Tabs
      defaultValue={
        searchParams.get(SEARCH_PARAMS_SYMBOL.INTERVAL) || undefined
      }
    >
      <TabsList>
        {intervals.map((interval, i) => (
          <TabsTrigger
            key={interval}
            value={interval}
            onClick={() => {
              redirectWithSearchParams({
                [SEARCH_PARAMS_SYMBOL.START_TIME]: START_TIMES[i],
                [SEARCH_PARAMS_SYMBOL.INTERVAL]: interval,
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
