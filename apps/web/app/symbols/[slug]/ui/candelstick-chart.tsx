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
import { useCallback } from 'react';
import { TimeIntervalTabs } from './time-interval-tabs';
import { TopAndBottomMarkers } from '@/lib/chart/marker-detector/top-and-bottom-markers';
import { MarkerDetector } from '@/lib/chart/marker-detector';
import { TopMarkers } from '../../../../lib/chart/marker-detector/top-markers';

const detectors: MarkerDetector[] = [new TopMarkers()];

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
  const onInit = useCallback(
    (handler: LightWeightChartHandler) => {
      const series = handler.chart.addCandlestickSeries();

      series.setData(handler.klinesToCandlestickSeries(klines));

      const markers = detectors
        .map((detector) => detector.execute(klines))
        .flat()
        .sort((a, b) => +a.time - +b.time);

      series.setMarkers(markers);

      if (api.market.isRealTimeEnabled()) {
        handler.realTimeUpdate({
          series,
          url: `/api/symbols/${slug}/lastKline?${SEARCH_PARAMS.INTERVAL}=${interval}`,
        });
      }
    },
    [klines, slug, interval]
  );

  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <div
      className={
        'flex flex-col flex-1 gap-8 p-8 border-[1px] rounded-lg ' + className
      }
    >
      <TimeIntervalTabs intervals={intervals} />
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
