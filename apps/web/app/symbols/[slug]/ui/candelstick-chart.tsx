'use client';

import { SEARCH_PARAMS } from '@/app/constants/navigation';
import { LightWeightChart } from '@/components/chart-lightweight';
import { Combobox } from '@/components/combobox';
import { Card, CardContent } from '@/components/ui/card';
import api from '@/lib/api';
import { LightWeightChartHandler } from '@/lib/chart/lightweight-chart';
import { MarkerDetector } from '@/lib/chart/marker-detector';
import { TopAndBottomMarkers } from '@/lib/chart/marker-detector/top-and-bottom-markers';
import { TopMarkers } from '@/lib/chart/marker-detector/top-markers';
import {
  OPTIONS_DARK,
  OPTIONS_LIGHT,
} from '@/styles/lightweight-charts-options';
import { useTheme } from 'next-themes';
import { useCallback, useMemo, useState } from 'react';
import { TimeIntervalTabs } from './time-interval-tabs';

export default function CandelstickChart({
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
  const [comboboxValues, setComboboxValues] = useState<string[]>([]);

  const markerDetectorSet: {
    [key: string]: MarkerDetector;
  } = useMemo(
    () => ({
      'top-bottom': new TopAndBottomMarkers(),
      top: new TopMarkers(),
    }),
    [isLight]
  );

  const onInit = useCallback(
    (handler: LightWeightChartHandler) => {
      const series = handler.chart.addCandlestickSeries();

      series.setData(handler.klinesToCandlestickSeries(klines));

      series.setMarkers(
        comboboxValues
          .map((option) => markerDetectorSet[option].execute(klines))
          .flat()
          .sort((a, b) => +a.time - +b.time)
      );

      if (api.market.isRealTimeEnabled()) {
        handler.realTimeUpdate({
          series,
          url: `/api/symbols/${slug}/lastKline?${SEARCH_PARAMS.INTERVAL}=${interval}`,
        });
      }
    },
    [klines, slug, interval, comboboxValues]
  );
  return (
    <Card className={'flex flex-1 gap-8 ' + className}>
      <CardContent className='flex flex-col flex-1 gap-8 p-8'>
        <div className='flex gap-4'>
          <TimeIntervalTabs intervals={intervals} />
          <Combobox
            multiple
            placeholder={'Select markers...'}
            search={'Search markers...'}
            noOptions={'No markers found.'}
            values={comboboxValues}
            options={Object.keys(MARKER_OPTION_LABELS_SET).map((key) => ({
              value: key,
              label: MARKER_OPTION_LABELS_SET[key],
            }))}
            onSelect={(value) => {
              setComboboxValues(
                comboboxValues.includes(value)
                  ? comboboxValues.filter((detector) => detector !== value)
                  : [...comboboxValues, value]
              );
            }}
          />
        </div>
        <div className='flex flex-col flex-1 overflow-hidden'>
          <LightWeightChart
            className='flex-1 pr-2'
            onInit={onInit}
            options={isLight ? OPTIONS_LIGHT : OPTIONS_DARK}
          />
        </div>
      </CardContent>
    </Card>
  );
}

const MARKER_OPTION_LABELS_SET: {
  [key: string]: string;
} = {
  'top-bottom': 'Top and Bottom',
  top: 'Top',
};
