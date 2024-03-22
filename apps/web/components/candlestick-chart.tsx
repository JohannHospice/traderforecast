'use client';
import { LightweightCandlestick } from '@/lib/chart/candlestick/lightweight-candlestick';
import { IndicatorKeys } from '@/lib/constants/indicator';
import { formatNumber } from '@/lib/helpers/string';
import {
  OPTIONS_DARK,
  OPTIONS_LIGHT,
} from '@/styles/lightweight-charts-options';
import { IChartApi, createChart } from 'lightweight-charts';
import { useTheme } from 'next-themes';
import { useEffect, useRef } from 'react';
import { LightWeightChart } from './chart-lightweight';

const ENABLE_REALTIME = process.env.NEXT_PUBLIC_ENABLE_REALTIME === 'true';

export function CandleStickChart({
  klines = [],
  selectedIndicators = [],
  onLoadMore,
}: {
  klines: Kline[];
  selectedIndicators?: IndicatorKeys[];
  onLoadMore?: () => void;
}) {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const containerRef = useRef<HTMLDivElement | null>(null);
  const divRef = useRef<HTMLDivElement | null>(null);
  const chart = useRef<IChartApi | null>(null);
  const candlestick = useRef<LightweightCandlestick | null>(null);

  // onInit
  useEffect(
    () => {
      if (
        divRef.current === null ||
        containerRef.current === null ||
        chart.current !== null
      ) {
        return;
      }
      console.log('init');

      chart.current = createChart(divRef.current);
      chart.current.timeScale().fitContent();
      candlestick.current = new LightweightCandlestick(
        chart.current.addCandlestickSeries(),
        isLight
      );

      const handleResize = () => {
        console.log(chart.current?.timeScale().getVisibleRange());
        chart.current?.applyOptions({
          width: containerRef.current?.clientWidth,
          height: containerRef.current?.clientHeight,
        });
      };

      window.addEventListener('resize', handleResize);

      return () => {
        console.log('cleanup');

        if (chart.current) {
          chart.current.remove();
          chart.current = null;
        }
        window.removeEventListener('resize', handleResize);
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [divRef.current, containerRef.current]
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
