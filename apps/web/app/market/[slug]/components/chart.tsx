'use client';
import { ChartBase } from '@/components/lightweight-chart/chart';
import { Series } from '@/components/lightweight-chart/series';
import api from '@/lib/api';
import { IndicatorHandler } from '@/lib/modules/chart/handlers/indicator-handler';
import { IndicatorValues } from '@/lib/constants/indicator';
import { SEARCH_PARAMS } from '@/lib/constants/navigation';
import { useChartSettings } from '@/lib/contexts/chart-settings-context';
import { getNumberOfKlinesResponsive } from '@/lib/helpers/klines';
import { klineToCandlestick } from '@/lib/helpers/lightweight-charts';
import { useRedirectParams } from '@/lib/hooks/use-redirect-params';
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

const REALTIME_INTERVAL_DELAY: Record<IntervalKeys | string, number> = {
  '1m': 1000 * 60,
  '5m': 1000 * 60 * 5,
  '15m': 1000 * 60 * 15,
  '30m': 1000 * 60 * 30,
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
  klines,
  interval = '1d',
  onGetMoreData,
  startUtc = '',
  getLatestKline,
  className,
}: {
  klines: Kline[];
  interval?: IntervalKeys;
  getLatestKline?: () => Promise<Kline>;
  onGetMoreData?: (start: string) => void;
  startUtc?: string;
  className?: string;
}) {
  const { indicators, customIndicators, live, lock, setLock } =
    useChartSettings();
  const { theme } = useTheme();

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
    if (!getLatestKline) {
      return () => {};
    }

    const intervalId = setInterval(async () => {
      if (!getLatestKline) {
        return;
      }
      const hotKline = await getLatestKline();

      try {
        series.current?.update(klineToCandlestick(hotKline));
      } catch (error) {
        console.error(error);
      }
    }, REALTIME_INTERVAL_DELAY[interval] || REALTIME_INTERVAL_DELAY['1d']);

    return () => clearInterval(intervalId);
  }, [getLatestKline, interval]);

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
      if (!onGetMoreData) {
        return;
      }
      console.log(
        waitingTimeRangeUpdate.current === null ||
          !candelstickChannels.current[interval] ||
          !series.current ||
          !live
      );

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

      const match = /utc_now-(\d+)(\w)/.exec(startUtc);

      if (!match) {
        return;
      }

      const [_, number, unit] = match;
      const newStart = `utc_now-${parseInt(number) + getNumberOfKlinesResponsive()}${unit}`;

      waitingTimeRangeUpdate.current = null;
      onGetMoreData(newStart);
    },
    [interval, live, onGetMoreData, startUtc]
  );

  // reset waiting time range update
  useLayoutEffect(() => {
    waitingTimeRangeUpdate.current = startUtc;
  }, [startUtc]);

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
      indicators.map((indicator) => IndicatorValues[indicator]),
      customIndicators,
      theme === 'light'
    );

    return () => {
      instance.clear();
    };
  }, [indicators, interval, klines, customIndicators, theme]);

  // on lock
  useLayoutEffect(() => {
    chart.current?.priceScale('right').applyOptions({
      autoScale: lock,
    });

    const timeout = setInterval(() => {
      const autoScale = !!chart.current?.priceScale('right').options()
        .autoScale;

      if (autoScale !== lock) {
        setLock(autoScale);
      }
    }, 500);

    return () => {
      clearInterval(timeout);
    };
  }, [lock, setLock]);

  return (
    <ChartBase
      ref={chart}
      options={chartOptions}
      onTimeRangeChange={onTimeRangeChange}
      className={className}
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
