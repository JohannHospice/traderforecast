'use client';

import { LightWeightChart } from '@/components/chart-lightweight';
import { Combobox } from '@/components/combobox';
import { Card, CardContent } from '@/components/ui/card';
import api from '@/lib/api';
import { MarkerDetector } from '@/lib/chart/marker-detector';
import { TopAndBottomMarkers } from '@/lib/chart/marker-detector/top-and-bottom-markers';
import { TopMarkers } from '@/lib/chart/marker-detector/top-markers';
import { Realtime } from '@/lib/helpers/realtime';
import {
  OPTIONS_DARK,
  OPTIONS_LIGHT,
} from '@/styles/lightweight-charts-options';
import { IChartApi } from 'lightweight-charts';
import { useTheme } from 'next-themes';
import { useCallback, useMemo, useState } from 'react';
import { klineToCandlestick } from '../helpers/klineToCandlestick';
import { TimeIntervalTabs } from './time-interval-tabs';

const ENABLE_REALTIME = false;
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
    (chart: IChartApi) => {
      const series = chart.addCandlestickSeries();

      // creating candlestick series
      series.setData(klines.map(klineToCandlestick));

      // applying strategy markers
      series.setMarkers(
        comboboxValues
          .map((option) => markerDetectorSet[option].execute(klines))
          .flat()
          .sort((a, b) => +a.time - +b.time)
      );

      // hot reload
      const realtimeApi = new Realtime(1000);
      if (ENABLE_REALTIME && slug && interval) {
        realtimeApi.watch(async () => {
          const kline = await api.realtimeMarket.hotKline(slug, interval);

          series.update(klineToCandlestick(kline));
        });
      }

      // cleanup
      return () => {
        chart.removeSeries(series);
        realtimeApi.clear();
      };
    },
    [klines, slug, interval, comboboxValues]
  );

  return (
    <Card className={'flex flex-1 gap-8' + className}>
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
        <LightWeightChart
          className='flex-1 min-h-[480px] mr-2'
          onInit={onInit}
          options={isLight ? OPTIONS_LIGHT : OPTIONS_DARK}
        />
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
