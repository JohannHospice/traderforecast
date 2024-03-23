'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import api from '@/lib/api';
import { IndicatorKeys } from '@/lib/constants/indicator';
import { klineToCandlestick } from '@/lib/helpers/lightweight-charts';
import {
  OPTIONS_DARK,
  OPTIONS_LIGHT,
} from '@/styles/lightweight-charts-options';
import {
  CandlestickData,
  ISeriesApi,
  Range,
  SeriesType,
  Time,
} from 'lightweight-charts';
import { useTheme } from 'next-themes';
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { CardChartHeader } from './card-chart-header';
import { Chart } from './lightweight-chart/chart';
import { Series } from './lightweight-chart/series';
import { useRedirectWithSearchParams } from '../../../../lib/hooks/useRedirectWithSearchParams';
import { SEARCH_PARAMS } from '../../../../lib/constants/navigation';
import { getNumberOfKlinesResponsive } from '../../../../lib/helpers/klines';

const REALTIME_INTERVAL_DELAY: Record<IntervalKeys, number> = {
  '1h': 1000 * 60 * 60,
  '4h': 1000 * 60 * 60 * 4,
  '1d': 1000 * 60 * 60 * 24,
  '1w': 1000 * 60 * 60 * 24 * 7,
  '2w': 1000 * 60 * 60 * 24 * 14,
};

export default function CardChart({
  slug,
  interval = '1d',
  klines,
  intervals = [],
  className,
  noBorder,
}: {
  slug?: string;
  klines: Kline[];
  intervals?: IntervalKeys[];
  className?: string;
  interval?: IntervalKeys;
  noBorder?: boolean;
}) {
  const { theme } = useTheme();
  const { redirectWithSearchParams, searchParams } =
    useRedirectWithSearchParams();

  const chartLayoutOptions = useMemo(
    () => (theme === 'light' ? OPTIONS_LIGHT : OPTIONS_DARK),
    [theme]
  );

  const [indices, setIndices] = useState<IndicatorKeys[]>([]);

  const series = useRef<ISeriesApi<SeriesType> | null>(null);
  const klineChannels = useRef<Record<string, Kline[] | null>>({});
  const candelstickChannels = useRef<
    Record<string, CandlestickData<Time>[] | null>
  >({});
  const waitingTimeRangeUpdate = useRef<string | null>(null);

  // update klines on interval
  const realtime = useCallback(() => {
    if (!slug) {
      return () => {};
    }

    const intervalId = setInterval(async () => {
      const hotKline = await api.realtimeMarket.hotKline(slug, interval);

      try {
        series.current?.update(klineToCandlestick(hotKline));
      } catch (error) {
        console.error(error);
      }
    }, REALTIME_INTERVAL_DELAY[interval] || REALTIME_INTERVAL_DELAY['1d']);

    return () => clearInterval(intervalId);
  }, [slug, interval]);

  // update candlestick channels
  const updateCandlestickChannels = useCallback(() => {
    const updatedCandlesticks = klines.map(klineToCandlestick);

    klineChannels.current[interval] = klines;
    candelstickChannels.current[interval] = updatedCandlesticks;
    return updatedCandlesticks;
  }, [interval, klines]);

  // on time range change
  const onTimeRangeChange = useCallback(
    ({ from }: Range<Time>) => {
      if (
        waitingTimeRangeUpdate.current === null ||
        !candelstickChannels.current[interval] ||
        !series.current
      ) {
        return;
      }
      const serieFrom = candelstickChannels.current[interval]?.[0]?.time;

      if (!serieFrom || +from - +serieFrom > 0) {
        return;
      }

      const startUtc = searchParams.get(SEARCH_PARAMS.START_TIME) || '';

      const match = /utc_now-(\d+)(\w)/.exec(startUtc);

      if (!match) {
        return;
      }

      const [_, number, unit] = match;
      const newStart = `utc_now-${parseInt(number) + getNumberOfKlinesResponsive()}${unit}`;

      console.log({ newStart, startUtc });

      waitingTimeRangeUpdate.current = null;
      redirectWithSearchParams({
        [SEARCH_PARAMS.START_TIME]: newStart,
      });
    },
    [interval, redirectWithSearchParams, searchParams]
  );

  useLayoutEffect(() => {
    waitingTimeRangeUpdate.current = searchParams.get(SEARCH_PARAMS.START_TIME);
  }, [searchParams]);

  // on mount
  useLayoutEffect(() => {
    const updatedCandlesticks = updateCandlestickChannels();
    series.current?.setData(updatedCandlesticks);

    return realtime();
  }, [updateCandlestickChannels, realtime]);

  return (
    <Card
      className={
        'flex flex-col flex-1 ' +
        (noBorder ? ' border-0 sm:border-[1px]' : '') +
        ' ' +
        className
      }
    >
      <CardHeader>
        <CardChartHeader
          intervals={intervals}
          valuesMarker={indices}
          onSelectMarker={(value) => {
            setIndices(
              indices.includes(value)
                ? indices.filter((detector) => detector !== value)
                : [...indices, value]
            );
          }}
        />
      </CardHeader>
      <CardContent className='flex flex-1'>
        <Chart
          options={chartLayoutOptions}
          onTimeRangeChange={onTimeRangeChange}
        >
          <Series
            ref={series}
            data={candelstickChannels.current[interval] || []}
            type='Candlestick'
          />
        </Chart>
      </CardContent>
    </Card>
  );
}
