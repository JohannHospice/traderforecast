'use client';

import { LightWeightChart } from '@/components/chart-lightweight';
import { ColorType } from 'lightweight-charts';
import { useCallback } from 'react';
import api from '@/lib/api';
import { LightWeightChartHandler } from '@/lib/chart/lightweight-chart';
import { IntervalNav } from './interval-nav';
import { realTimeUpdate } from './realTimeUpdate';

export function KlinesChart({
  slug,
  interval,
  klines,
  intervals,
  className,
}: {
  slug: string;
  klines: Kline[];
  intervals: string[];
  className?: string;
  interval: string;
}) {
  const onInit = useCallback(
    (chart: LightWeightChartHandler) => {
      const series = chart.chart.addCandlestickSeries();

      series.setData(chart.klinesToCandlestickSeries(klines));
      // serie.setMarkers(findTopsAndBottoms(klines));

      if (api.market.isRealTimeEnabled()) {
        const timeoutInterval = realTimeUpdate({
          chart,
          series,
          slug: slug,
          interval: interval,
        });

        return () => clearInterval(timeoutInterval);
      }
    },
    [klines, slug, interval]
  );

  return (
    <div className={'flex flex-col flex-1 gap-4 ' + className}>
      <IntervalNav intervals={intervals} />
      <div className='flex flex-col flex-1 border-[1px] border-gray-200 rounded-lg overflow-hidden'>
        <LightWeightChart
          className='flex-1 pr-2'
          onInit={onInit}
          options={{
            layout: {
              background: {
                type: ColorType.Solid,
                color: 'white',
              },
              textColor: 'black',
            },
            grid: {
              vertLines: {
                color: COLOR_GRAY_200,
              },
              horzLines: {
                color: COLOR_GRAY_200,
              },
            },
            timeScale: {
              borderColor: COLOR_GRAY_200,
            },
            rightPriceScale: {
              borderColor: COLOR_GRAY_200,
            },
          }}
        />
      </div>
    </div>
  );
}

const COLOR_GRAY_200 = 'rgba(197, 203, 206, 0.5)';
