'use client';

import { CandleStickChart } from '@/components/candlestick-chart';
import { Card, CardContent } from '@/components/ui/card';
import { BottomMarkers } from '@/lib/chart/serie-applier/detector/marker-detector/bottom-markers';
import { TopAndBottomMarkers } from '@/lib/chart/serie-applier/detector/marker-detector/top-and-bottom-markers';
import { TopMarkers } from '@/lib/chart/serie-applier/detector/marker-detector/top-markers';
import { ResistanceDetector } from '@/lib/chart/serie-applier/detector/price-line-detector/resistance-detector';
import { MarkerSerieApplier } from '@/lib/chart/serie-applier/marker-serie-applier';
import { PriceLineSerieApplier } from '@/lib/chart/serie-applier/priceline-serie-applier';
import { SerieApplierKeys } from '@/lib/constants/serie-applier';
import { useTheme } from 'next-themes';
import { useMemo, useState } from 'react';
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
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [selectedSerieAppliers, setSelectedSerieAppliers] = useState<
    SerieApplierKeys[]
  >([]);
  const serieApplierSet = useMemo(
    () => ({
      'top-bottom': new MarkerSerieApplier(new TopAndBottomMarkers()),
      top: new MarkerSerieApplier(new TopMarkers()),
      bottom: new MarkerSerieApplier(new BottomMarkers()),
      resistance: new PriceLineSerieApplier(new ResistanceDetector()),
    }),
    [isLight]
  );

  return (
    <Card className={'flex flex-1 gap-8 ' + className}>
      <CardContent className='flex flex-col flex-1 gap-8 p-8'>
        <CardChartHeader
          intervals={intervals}
          valuesMarker={selectedSerieAppliers}
          onSelectMarker={(value) => {
            setSelectedSerieAppliers(
              selectedSerieAppliers.includes(value)
                ? selectedSerieAppliers.filter((detector) => detector !== value)
                : [...selectedSerieAppliers, value]
            );
          }}
        />
        <CandleStickChart
          interval={interval}
          klines={klines}
          slug={slug}
          selectedDetectors={selectedSerieAppliers}
          serieApplierSet={serieApplierSet}
        />
      </CardContent>
    </Card>
  );
}
