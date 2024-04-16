'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { CardChartHeader } from './card-chart-header';
import { Chart } from './chart';
import { useRedirectParams } from '../../../../lib/hooks/use-redirect-params';
import { SEARCH_PARAMS } from '../../../../lib/constants/navigation';
import api from '../../../../lib/api';

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
  const { redirectParams, searchParams } = useRedirectParams();
  return (
    <Card noBorder className={'flex flex-col flex-1 ' + className}>
      <CardHeader>
        <CardChartHeader intervals={intervals} />
      </CardHeader>
      <CardContent className='flex flex-1 min-h-[calc(100vh-84px-53px)] sm:min-h-[calc(100vh-224px)] md:min-h-[480px]'>
        <Chart
          klines={klines}
          interval={interval}
          startUtc={searchParams.get(SEARCH_PARAMS.START_TIME) || ''}
          onGetMoreData={(newStart) => {
            redirectParams(
              {
                [SEARCH_PARAMS.START_TIME]: newStart,
              },
              {
                scroll: false,
              }
            );
          }}
          getLatestKline={
            slug && interval
              ? () => api.realtimeMarket.getLatestKline(slug, interval)
              : undefined
          }
        />
      </CardContent>
    </Card>
  );
}
