'use client';
import { LightWeightChart } from '@/components/chart-lightweight';
import api from '@/lib/api';
import { LightweightCandlestick } from '@/lib/chart/candlestick/lightweight-candlestick';
import { Indicators, SerieApplierKeys } from '@/lib/constants/serie-applier';
import { Realtime } from '@/lib/helpers/realtime';
import { formatNumber } from '@/lib/helpers/string';
import {
  OPTIONS_DARK,
  OPTIONS_LIGHT,
} from '@/styles/lightweight-charts-options';
import { IChartApi } from 'lightweight-charts';
import { useTheme } from 'next-themes';
import { useCallback } from 'react';

const ENABLE_REALTIME = process.env.NEXT_PUBLIC_ENABLE_REALTIME === 'true';

export function CandleStickChart({
  interval,
  klines,
  slug,
  selectedIndices = [],
}: {
  interval?: string;
  klines: Kline[];
  slug?: string;
  selectedIndices?: SerieApplierKeys[];
}) {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const onInit = useCallback(
    (chart: IChartApi) => {
      const candlestick = new LightweightCandlestick(
        chart.addCandlestickSeries(),
        isLight
      );

      candlestick.setData(klines);

      candlestick.applyIndices(
        selectedIndices.map((key) => {
          const Indice = Indicators[key];
          return new Indice();
        })
      );

      // hot reload
      const realtimeApi = new Realtime(1000);
      if (ENABLE_REALTIME && slug && interval) {
        realtimeApi.watch(async () => {
          candlestick.update([
            await api.realtimeMarket.hotKline(slug, interval),
          ]);
        });
      }

      // cleanup
      return () => {
        realtimeApi.clear();
      };
    },
    [klines, slug, interval, isLight, selectedIndices]
  );

  // TODO Create an onUpdate to add islight and selectedindices update init

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
