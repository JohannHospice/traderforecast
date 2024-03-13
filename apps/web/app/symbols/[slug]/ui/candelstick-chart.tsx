'use client';

import { SEARCH_PARAMS_SYMBOL } from '@/app/constants/navigation';
import { LightWeightChart } from '@/components/chart-lightweight';
import api from '@/lib/api';
import { findTopsAndBottoms } from '@/lib/chart/findTopsAndBottoms';
import { LightWeightChartHandler } from '@/lib/chart/lightweight-chart';
import { ColorType } from 'lightweight-charts';
import { useCallback } from 'react';
import { COLOR_GRAY_200 } from '../../../../styles/colors';
import { TimeIntervalTabs } from './time-interval-tabs';

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
      series.setMarkers(findTopsAndBottoms(klines));

      if (api.market.isRealTimeEnabled()) {
        handler.realTimeUpdate({
          series,
          url: `/api/symbols/${slug}/lastKline?${SEARCH_PARAMS_SYMBOL.INTERVAL}=${interval}`,
        });
      }
    },
    [klines, slug, interval]
  );

  return (
    <div className={'flex flex-col flex-1 gap-4 ' + className}>
      <TimeIntervalTabs intervals={intervals} />
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
