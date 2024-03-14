'use client';

import { CandleStickChart } from '@/components/candlestick-chart';
import { Card, CardContent } from '@/components/ui/card';
import { SerieApplierKeys } from '@/lib/constants/serie-applier';
import { useState } from 'react';
import { CardChartHeader } from './card-chart-header';

export default function CardChart({
  slug,
  interval,
  klines,
  intervals = [],
  className,
}: {
  slug?: string;
  klines: Kline[];
  intervals?: string[];
  className?: string;
  interval?: string;
}) {
  const [indices, setIndices] = useState<SerieApplierKeys[]>([]);

  return (
    <Card className={'flex flex-1 gap-8 ' + className}>
      <CardContent className='flex flex-col flex-1 gap-8 p-8'>
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
