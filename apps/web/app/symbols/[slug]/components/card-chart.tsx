'use client';

import { CandleStickChart } from '@/components/candlestick-chart';
import { Card, CardContent } from '@/components/ui/card';
import { MarkerKeys } from '@/lib/hooks/useMarkerDetector';
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
  const [selectedMarkers, setSelectedMarkers] = useState<MarkerKeys[]>([]);

  return (
    <Card className={'flex flex-1 gap-8 ' + className}>
      <CardContent className='flex flex-col flex-1 gap-8 p-8'>
        <CardChartHeader
          intervals={intervals}
          valuesMarker={selectedMarkers}
          onSelectMarker={(value) => {
            setSelectedMarkers(
              selectedMarkers.includes(value)
                ? selectedMarkers.filter((detector) => detector !== value)
                : [...selectedMarkers, value]
            );
          }}
        />
        <CandleStickChart
          interval={interval}
          klines={klines}
          slug={slug}
          valuesMarker={selectedMarkers}
        />
      </CardContent>
    </Card>
  );
}
