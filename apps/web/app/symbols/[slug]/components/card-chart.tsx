'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { CardChartHeader } from './card-chart-header';
import { Chart } from './chart';

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
  return (
    <Card noBorder className={'flex flex-col flex-1 ' + className}>
      <CardHeader>
        <CardChartHeader intervals={intervals} />
      </CardHeader>
      <CardContent className='flex flex-1 min-h-[612px]'>
        <Chart slug={slug} klines={klines} interval={interval} />
      </CardContent>
    </Card>
  );
}
