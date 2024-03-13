'use client';
import { LightWeightChart } from '@/components/chart-lightweight';
import api from '@/lib/api';
import { klineToCandlestick } from '@/lib/helpers/lightweight-charts';
import { Realtime } from '@/lib/helpers/realtime';
import {
  OPTIONS_DARK,
  OPTIONS_LIGHT,
} from '@/styles/lightweight-charts-options';
import { IChartApi } from 'lightweight-charts';
import { useTheme } from 'next-themes';
import { useCallback } from 'react';
import { MarkerKeys, useMarkerDetector } from '../lib/hooks/useMarkerDetector';

export function CandleStickChart({
  interval,
  klines,
  slug,
  valuesMarker = [],
}: {
  interval?: string;
  klines: Kline[];
  slug?: string;
  onSelectMarker?: (value: string) => void;
  valuesMarker?: MarkerKeys[];
}) {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const markerDetectorSet = useMarkerDetector(isLight);

  const onInit = useCallback(
    (chart: IChartApi) => {
      const series = chart.addCandlestickSeries();

      // creating candlestick series
      series.setData(klines.map(klineToCandlestick));

      // applying strategy markers
      series.setMarkers(
        valuesMarker
          .map((option) => markerDetectorSet[option].execute(klines))
          .flat()
          .sort((a, b) => +a.time - +b.time)
      );

      // hot reload
      const realtimeApi = new Realtime(1000);
      if (process.env.DISABLE_REALTIME && slug && interval) {
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
    [klines, slug, interval, valuesMarker]
  );

  return (
    <LightWeightChart
      className='flex flex-1 min-h-[480px]'
      onInit={onInit}
      options={isLight ? OPTIONS_LIGHT : OPTIONS_DARK}
    />
  );
}
