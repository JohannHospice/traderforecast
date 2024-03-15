'use client';

import { CandleStickChart } from '@/components/candlestick-chart';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { SerieApplierKeys } from '@/lib/constants/serie-applier';
import { useState } from 'react';
import { CardChartHeader } from './card-chart-header';

export default function CardChart({
  slug,
  interval,
  klines,
  intervals = [],
  className,
  noBorder,
}: {
  slug?: string;
  klines: Kline[];
  intervals?: string[];
  className?: string;
  interval?: string;
  noBorder?: boolean;
}) {
  const [indices, setIndices] = useState<SerieApplierKeys[]>([]);

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
          valuesMarker={indices}
          onSelectMarker={(value) => {
            setIndices(
              indices.includes(value)
                ? indices.filter((detector) => detector !== value)
                : [...indices, value]
            );
          }}
        />
      </CardHeader>
      <CardContent className='flex flex-1 '>
        <CandleStickChart
          interval={interval}
          klines={klines}
          slug={slug}
          selectedIndices={indices}
        />
      </CardContent>
    </Card>
  );
}
