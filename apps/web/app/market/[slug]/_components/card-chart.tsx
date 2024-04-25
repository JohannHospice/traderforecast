'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { actionGetLastOHLC } from '@/lib/api/actions/get-last-ohlcs';
import { SEARCH_PARAMS } from '@/lib/constants/navigation';
import { getNumberOfKlinesResponsive } from '@/lib/helpers/klines';
import { useRedirectParams } from '@/lib/hooks/use-redirect-params';
import { Chart } from '@traderforecast/ui-chart';
import { useTheme } from 'next-themes';
import { CardChartHeader } from './card-chart-header';

// TODO: refactor and separate the header from the chart
// also create a easy tuning chart component to add or remove feature
export default function CardChart({
  slug,
  interval = '1d',
  klines,
  intervals = [],
  className,
}: {
  slug?: string;
  klines: Kline[];
  intervals?: IntervalKeys[];
  className?: string;
  interval?: IntervalKeys;
}) {
  const { theme } = useTheme();
  const { redirectParams, searchParams } = useRedirectParams();
  return (
    <Card noBorder className={'flex flex-col flex-1 ' + className}>
      <CardHeader>
        <CardChartHeader intervals={intervals} />
      </CardHeader>
      <CardContent className='flex flex-1 min-h-[calc(100vh-84px-53px)] sm:min-h-[calc(100vh-224px)] md:min-h-[480px]'>
        <Chart
          offsetKlines={getNumberOfKlinesResponsive()}
          klines={klines}
          interval={interval}
          theme={theme}
          startUtc={searchParams.get(SEARCH_PARAMS.START_TIME) || ''}
          onChangeStartDate={(newStart) => {
            redirectParams(
              {
                [SEARCH_PARAMS.START_TIME]: newStart,
              },
              {
                scroll: false,
              }
            );
          }}
          onRealtimeKline={
            slug && interval
              ? () =>
                  actionGetLastOHLC({
                    interval,
                    slug,
                  })
              : undefined
          }
        />
      </CardContent>
    </Card>
  );
}
