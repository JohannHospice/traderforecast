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
  noBorder,
}: {
  slug?: string;
  klines: Kline[];
  intervals?: IntervalKeys[];
  className?: string;
  interval?: IntervalKeys;
  noBorder?: 'sm' | 'md' | 'lg';
}) {
  return (
    <Card noBorder={noBorder} className={'flex flex-col flex-1 ' + className}>
      <CardHeader>
        <CardChartHeader intervals={intervals} />
      </CardHeader>
      <CardContent className='flex flex-1 min-h-[calc(100vh-84px-53px)] sm:min-h-[calc(100vh-224px)] md:min-h-[480px]'>
        <Chart slug={slug} klines={klines} interval={interval} />
      </CardContent>
    </Card>
  );
}
