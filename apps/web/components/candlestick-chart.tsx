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
import {
  MarkerKeys,
  useChartDetector as useChartDetector,
} from '../lib/hooks/useMarkerDetector';
import { formatNumber } from '../lib/helpers/string';

export function CandleStickChart({
  interval,
  klines,
  slug,
  valuesMarker: selectedDetectors = [],
}: {
  interval?: string;
  klines: Kline[];
  slug?: string;
  onSelectMarker?: (value: string) => void;
  valuesMarker?: MarkerKeys[];
}) {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const detectorSet = useChartDetector(isLight);

  const onInit = useCallback(
    (chart: IChartApi) => {
      const series = chart.addCandlestickSeries();

      // const areaSeries = chart.addAreaSeries({
      //   lineColor: '#2962FF',
      //   topColor: '#2962FF',
      //   bottomColor: 'rgba(41, 98, 255, 0.28)',
      // });
      // areaSeries.setData([
      //   { value: 24000, time: 1642425322 },
      //   { value: 8, time: 1642511722 },
      //   { value: 10, time: 1642598122 },
      //   { value: 20, time: 1642684522 },
      //   { value: 3, time: 1642770922 },
      //   { value: 43, time: 1642857322 },
      //   { value: 41, time: 1642943722 },
      //   { value: 43, time: 1643030122 },
      //   { value: 25000, time: 1643116522 },
      //   { value: 73000, time: 1643202922 * 100 },
      // ]);

      if (!isLight) {
        series.applyOptions({
          wickUpColor: 'rgb(54, 116, 217)',
          upColor: 'rgb(54, 116, 217)',
          wickDownColor: 'rgb(225, 50, 85)',
          downColor: 'rgb(225, 50, 85)',
          borderVisible: false,
        });
      }

      // creating candlestick series
      series.setData(klines.map(klineToCandlestick));

      // applying strategy markers
      selectedDetectors.map((option) => {
        detectorSet.get(option).apply(series, klines);
      });

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
    [klines, slug, interval, selectedDetectors]
  );

  return (
    <LightWeightChart
      className='flex flex-1 min-h-[480px]'
      onInit={onInit}
      options={{
        ...(isLight ? OPTIONS_LIGHT : OPTIONS_DARK),
        localization: {
          priceFormatter: formatNumber,
        },
      }}
    />
  );
}
