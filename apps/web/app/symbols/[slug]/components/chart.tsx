'use client';
import { ChartBase } from '@/components/lightweight-chart/chart';
import { Series } from '@/components/lightweight-chart/series';
import api from '@/lib/api';
import { IndicatorValues } from '@/lib/constants/indicator';
import { SEARCH_PARAMS } from '@/lib/constants/navigation';
import { getNumberOfKlinesResponsive } from '@/lib/helpers/klines';
import { klineToCandlestick } from '@/lib/helpers/lightweight-charts';
import { useRedirectWithSearchParams } from '@/lib/hooks/useRedirectWithSearchParams';
import {
  CANDLESTICK_DARK_OPTIONS,
  CANDLESTICK_LIGHT_OPTIONS,
  OPTIONS_DARK,
  OPTIONS_LIGHT,
} from '@/styles/lightweight-charts-options';
import {
  CandlestickData,
  IChartApi,
  ISeriesApi,
  Range,
  SeriesType,
  Time,
} from 'lightweight-charts';
import { useTheme } from 'next-themes';
import { useCallback, useLayoutEffect, useMemo, useRef } from 'react';
import { IndicatorHandler } from '../../../../lib/chart/handlers/indicator-handler';
import { useChartSettings } from '../contexts/chart-settings-context';

const REALTIME_INTERVAL_DELAY: Record<IntervalKeys, number> = {
  '1h': 1000 * 60 * 60,
  '4h': 1000 * 60 * 60 * 4,
  '1d': 1000 * 60 * 60 * 24,
  '1w': 1000 * 60 * 60 * 24 * 7,
  '2w': 1000 * 60 * 60 * 24 * 14,
};

const LIGHT_OPTIONS = {
  chartOptions: OPTIONS_LIGHT,
  seriesOptions: CANDLESTICK_LIGHT_OPTIONS,
};

const DARK_OPTIONS = {
  chartOptions: OPTIONS_DARK,
  seriesOptions: CANDLESTICK_DARK_OPTIONS,
};

export function Chart({
  slug,
  klines,
  interval = '1d',
}: {
  slug?: string;
  klines: Kline[];
  interval?: IntervalKeys;
}) {
  const { indicators, live } = useChartSettings();
  const { theme } = useTheme();
  const { redirectWithSearchParams, searchParams } =
    useRedirectWithSearchParams();

  const { chartOptions, seriesOptions } = useMemo(
    () => (theme === 'light' ? LIGHT_OPTIONS : DARK_OPTIONS),
    [theme]
  );

  const chart = useRef<IChartApi | null>(null);
  const series = useRef<ISeriesApi<SeriesType> | null>(null);
  const klineChannels = useRef<Record<string, Kline[] | null>>({});
  const candelstickChannels = useRef<
    Record<string, CandlestickData<Time>[] | null>
  >({});
  const waitingTimeRangeUpdate = useRef<string | null>(null);
  const indiceApplier = useRef<IndicatorHandler>(new IndicatorHandler());

  // update klines on interval
  const realtime = useCallback(() => {
    if (!slug || !live) {
      return () => {};
    }

    const intervalId = setInterval(async () => {
      const hotKline = await api.realtimeMarket.getLatestKline(slug, interval);

      try {
        series.current?.update(klineToCandlestick(hotKline));
      } catch (error) {
        console.error(error);
      }
    }, REALTIME_INTERVAL_DELAY[interval] || REALTIME_INTERVAL_DELAY['1d']);

    return () => clearInterval(intervalId);
  }, [slug, live, interval]);

  // update candlestick channels
  const updateCandlestickChannels = useCallback(() => {
    const updatedCandlesticks = klines.map(klineToCandlestick);

    klineChannels.current[interval] = klines;
    candelstickChannels.current[interval] = updatedCandlesticks;

    series.current?.setData(updatedCandlesticks);
  }, [interval, klines]);

  // on time range change
  const onTimeRangeChange = useCallback(
    ({ from }: Range<Time>) => {
      if (
        waitingTimeRangeUpdate.current === null ||
        !candelstickChannels.current[interval] ||
        !series.current ||
        !live
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
      redirectWithSearchParams(
        {
          [SEARCH_PARAMS.START_TIME]: newStart,
        },
        {
          scroll: false,
        }
      );
    },
    [interval, live, redirectWithSearchParams, searchParams]
  );

  // reset waiting time range update
  useLayoutEffect(() => {
    waitingTimeRangeUpdate.current = searchParams.get(SEARCH_PARAMS.START_TIME);
  }, [searchParams]);

  // on mount
  useLayoutEffect(() => {
    updateCandlestickChannels();

    const clearRealtime = realtime();
    return () => {
      clearRealtime();
    };
  }, [updateCandlestickChannels, realtime]);

  // on indicators
  useLayoutEffect(() => {
    const klines = klineChannels.current[interval];
    if (!chart.current || !series.current || !klines) return;

    const { current: instance } = indiceApplier;
    instance.assign(series.current, chart.current);
    instance.clear();
    instance.apply(
      klines,
      indicators.map((indicator) => IndicatorValues[indicator])
    );

    return () => {
      instance.clear();
    };
  }, [indicators, interval, klines]);

  return (
    <ChartBase
      ref={chart}
      options={chartOptions}
      onTimeRangeChange={onTimeRangeChange}
    >
      <Series
        type='Candlestick'
        ref={series}
        options={seriesOptions}
        data={
          // todo: refactor default data value
          candelstickChannels.current[interval] ||
          klines.map(klineToCandlestick) ||
          []
        }
      />
    </ChartBase>
  );
}
