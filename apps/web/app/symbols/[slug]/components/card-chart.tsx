'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { IndicatorKeys } from '@/lib/constants/indicator';
import { useState } from 'react';
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
  noBorder?: boolean;
}) {
  const [indicators, setIndicators] = useState<IndicatorKeys[]>([]);
  const [fixed, setFixed] = useState(false);
  return (
    <Card
      className={
        'flex flex-col flex-1 ' +
        (noBorder ? ' border-0 sm:border-[1px]' : '') +
        ' ' +
        className
      }
    >
      <CardHeader>
        <CardChartHeader
          intervals={intervals}
          valuesMarker={indicators}
          onSelectMarker={(value) => {
            setIndicators(
              indicators.includes(value)
                ? indicators.filter((detector) => detector !== value)
                : [...indicators, value]
            );
          }}
          fixed={fixed}
          onChangeFixed={(value) => {
            setFixed(value);
          }}
        />
      </CardHeader>
      <CardContent className='flex flex-1 min-h-[612px]'>
        <Chart
          slug={slug}
          klines={klines}
          interval={interval}
          indicators={indicators}
          fixed={fixed}
        />
      </CardContent>
    </Card>
  );
}
