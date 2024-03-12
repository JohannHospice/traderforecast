'use client';

import { LightWeightChart } from '@/components/chart-lightweight';
import { ColorType } from 'lightweight-charts';
import { useCallback } from 'react';
import api from '../../../../lib/api';
import { LightWeightChartHandler } from '../../../../lib/chart/lightweight-chart';
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
      <LightWeightChart
        className='flex-1'
        onInit={onInit}
        options={{
          layout: {
            background: {
              type: ColorType.Solid,
              color: 'white',
            },
            textColor: 'black',
          },
        }}
      />
    </div>
  );
}
