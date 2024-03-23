'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { IndicatorKeys } from '@/lib/constants/indicator';
import { useEffect, useState } from 'react';
import { CardChartHeader } from './card-chart-header';
import { ChartComponent } from './chart-component';

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
  intervals?: string[];
  className?: string;
  interval?: string;
  noBorder?: boolean;
}) {
  const [indices, setIndices] = useState<IndicatorKeys[]>([]);
  const [klinesByInterval, setKlinesByInterval] = useState<
    Record<string, Kline[]>
  >({});

  useEffect(() => {
    setKlinesByInterval((prev) => {
      const klinesSelected = prev[interval] || [];

      const newKlines = klines.filter(
        (kline) => !klinesSelected?.some((k) => k.openTime === kline.openTime)
      );

      if (newKlines.length === 0) {
        return prev;
      }
      prev[interval] = [...klinesSelected, ...newKlines];

      return prev;
    });
  }, [klines, interval]);

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
      <CardContent className='flex flex-1'>
        {/* <MyCandleStickChart
          selectedIndicators={indices}
          klines={klinesByInterval[interval]}
        /> */}
        <ChartComponent />
      </CardContent>
    </Card>
  );
}
