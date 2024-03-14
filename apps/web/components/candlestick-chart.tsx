'use client';
import { LightWeightChart } from '@/components/chart-lightweight';
import api from '@/lib/api';
import { Realtime } from '@/lib/helpers/realtime';
import {
  OPTIONS_DARK,
  OPTIONS_LIGHT,
} from '@/styles/lightweight-charts-options';
import { IChartApi } from 'lightweight-charts';
import { useTheme } from 'next-themes';
import { useCallback } from 'react';
import { CandlestickChartApplier } from '../lib/chart/chart-applier/candlestick-chart-applier';
import { SerieApplier } from '../lib/chart/serie-applier';
import { formatNumber } from '../lib/helpers/string';
import { SerieApplierKeys } from '../lib/constants/serie-applier';

const ENABLE_REALTIME = process.env.NEXT_PUBLIC_ENABLE_REALTIME === 'true';

export function CandleStickChart({
  interval,
  klines,
  slug,
  selectedDetectors: serieAppliers = [],
  serieApplierSet,
}: {
  interval?: string;
  klines: Kline[];
  slug?: string;
  selectedDetectors?: SerieApplierKeys[];
  serieApplierSet: {
    [key in SerieApplierKeys]: SerieApplier;
  };
}) {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const onInit = useCallback(
    (chart: IChartApi) => {
      const chartApplier = new CandlestickChartApplier(chart, isLight);
      chartApplier.add(klines);

      // applying strategy markers
      chartApplier.apply(
        serieAppliers.map((option) => serieApplierSet[option])
      );

      // hot reload
      const realtimeApi = new Realtime(1000);
      if (ENABLE_REALTIME && slug && interval) {
        realtimeApi.watch(async () => {
          chartApplier.update([
            await api.realtimeMarket.hotKline(slug, interval),
          ]);
        });
      }

      // cleanup
      return () => {
        chartApplier.clear();
        realtimeApi.clear();
      };
    },
    [klines, slug, interval, serieAppliers, isLight]
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
