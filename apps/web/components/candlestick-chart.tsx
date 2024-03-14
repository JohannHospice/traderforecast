'use client';
import { LightWeightChart } from '@/components/chart-lightweight';
import api from '@/lib/api';
import { Indicator } from '@/lib/chart/indicator';
import { Realtime } from '@/lib/helpers/realtime';
import {
  OPTIONS_DARK,
  OPTIONS_LIGHT,
} from '@/styles/lightweight-charts-options';
import { IChartApi } from 'lightweight-charts';
import { useTheme } from 'next-themes';
import { useCallback } from 'react';
import { LightweightCandlestick } from '@/lib/chart/candlestick/lightweight-candlestick';
import { BottomIndicator } from '@/lib/chart/indicator/bottom-indicator';
import { ResistanceIndicator } from '@/lib/chart/indicator/resistance-indicator';
import { TopAndBottomIndicator } from '@/lib/chart/indicator/top-and-bottom-indicator';
import { TopMarkersIndicator } from '@/lib/chart/indicator/top-indicator';
import { SerieApplierKeys as IndiceKey } from '@/lib/constants/serie-applier';
import { formatNumber } from '@/lib/helpers/string';

const ENABLE_REALTIME = process.env.NEXT_PUBLIC_ENABLE_REALTIME === 'true';

const INDICES = {
  topbottom: TopAndBottomIndicator,
  top: TopMarkersIndicator,
  bottom: BottomIndicator,
  resistance: ResistanceIndicator,
} as Record<IndiceKey, new () => Indicator>;

export function CandleStickChart({
  interval,
  klines,
  slug,
  selectedIndices = [],
}: {
  interval?: string;
  klines: Kline[];
  slug?: string;
  selectedIndices?: IndiceKey[];
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
          const Indice = INDICES[key];
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
