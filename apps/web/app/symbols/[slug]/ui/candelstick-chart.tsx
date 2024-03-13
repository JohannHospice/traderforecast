'use client';

import { SEARCH_PARAMS } from '@/app/constants/navigation';
import { LightWeightChart } from '@/components/chart-lightweight';
import api from '@/lib/api';
import { LightWeightChartHandler } from '@/lib/chart/lightweight-chart';
import {
  OPTIONS_DARK,
  OPTIONS_LIGHT,
} from '@/styles/lightweight-charts-options';
import { useTheme } from 'next-themes';
import { useCallback, useState } from 'react';
import { TimeIntervalTabs } from './time-interval-tabs';
import { TopAndBottomMarkers } from '@/lib/chart/marker-detector/top-and-bottom-markers';
import { MarkerDetector } from '@/lib/chart/marker-detector';
import { TopMarkers } from '@/lib/chart/marker-detector/top-markers';
import { Combobox } from '../../../../components/combobox';

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
  const [options, setOptions] = useState<OptionDetector[]>([]);

  const onInit = useCallback(
    (handler: LightWeightChartHandler) => {
      const series = handler.chart.addCandlestickSeries();

      series.setData(handler.klinesToCandlestickSeries(klines));

      series.setMarkers(
        options
          .map(({ detector }) => detector.execute(klines))
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
    [klines, slug, interval, options]
  );
  return (
    <div
      className={
        'flex flex-col flex-1 gap-8 p-8 border-[1px] rounded-lg ' + className
      }
    >
      <div className='flex gap-4'>
        <TimeIntervalTabs intervals={intervals} />
        <Combobox
          multiple
          placeholder={'Select markers...'}
          search={'Search markers...'}
          noOptions={'No markers found.'}
          options={Object.values(DETECTOR_DICT).map((detector) => ({
            value: detector.value,
            label: detector.label,
          }))}
          values={options.map((detector) => detector.value)}
          onSelect={(value) => {
            setOptions(
              options.includes(DETECTOR_DICT[value])
                ? options.filter((detector) => detector.value !== value)
                : [...options, DETECTOR_DICT[value]]
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
    </div>
  );
}

enum MARKER {
  TOP_BOTTOM = 'top-bottom',
  TOP = 'top',
}

type OptionDetector = {
  detector: MarkerDetector;
  value: MARKER;
  label: string;
};

const DETECTOR_DICT: {
  [key in MARKER]: OptionDetector;
} = {
  [MARKER.TOP_BOTTOM]: {
    detector: new TopAndBottomMarkers(),
    value: MARKER.TOP_BOTTOM,
    label: 'Top and Bottom',
  },
  [MARKER.TOP]: {
    detector: new TopMarkers(),
    value: MARKER.TOP,
    label: 'Top',
  },
};
