'use client';
import { ChartBase } from '@/components/lightweight-chart/chart';
import { Series } from '@/components/lightweight-chart/series';
import api from '@/lib/api';
import { LightWeightMarkerFactory } from '@/lib/chart/candlestick/marker-factory/lightweight-marker-factory';
import { LightWeightPriceLineFactory } from '@/lib/chart/candlestick/price-line-factory/lightweight-price-line-factory';
import { IndicatorKeys, IndicatorValues } from '@/lib/constants/indicator';
import { SEARCH_PARAMS } from '@/lib/constants/navigation';
import { getNumberOfKlinesResponsive } from '@/lib/helpers/klines';
import { klineToCandlestick } from '@/lib/helpers/lightweight-charts';
import { useRedirectWithSearchParams } from '@/lib/hooks/useRedirectWithSearchParams';
import {
  OPTIONS_DARK,
  OPTIONS_LIGHT,
} from '@/styles/lightweight-charts-options';
import {
  CandlestickData,
  IPriceLine,
  ISeriesApi,
  Range,
  SeriesType,
  Time,
} from 'lightweight-charts';
import { useTheme } from 'next-themes';
import { useCallback, useLayoutEffect, useMemo, useRef } from 'react';

const REALTIME_INTERVAL_DELAY: Record<IntervalKeys, number> = {
  '1h': 1000 * 60 * 60,
  '4h': 1000 * 60 * 60 * 4,
  '1d': 1000 * 60 * 60 * 24,
  '1w': 1000 * 60 * 60 * 24 * 7,
  '2w': 1000 * 60 * 60 * 24 * 14,
};

export function Chart({
  slug,
  klines,
  interval = '1d',
  indicators = [],
}: {
  slug?: string;
  klines: Kline[];
  interval?: IntervalKeys;
  indicators?: IndicatorKeys[];
}) {
  const { theme } = useTheme();
  const { redirectWithSearchParams, searchParams } =
    useRedirectWithSearchParams();

  const chartLayoutOptions = useMemo(
    () => (theme === 'light' ? OPTIONS_LIGHT : OPTIONS_DARK),
    [theme]
  );

  const series = useRef<ISeriesApi<SeriesType> | null>(null);
  const klineChannels = useRef<Record<string, Kline[] | null>>({});
  const candelstickChannels = useRef<
    Record<string, CandlestickData<Time>[] | null>
  >({});
  const waitingTimeRangeUpdate = useRef<string | null>(null);
  const priceLinesRef = useRef<IPriceLine[]>([]);

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

    series.current?.setData(updatedCandlesticks);
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

  // reset waiting time range update
  useLayoutEffect(() => {
    waitingTimeRangeUpdate.current = searchParams.get(SEARCH_PARAMS.START_TIME);
  }, [searchParams]);

  // on mount
  useLayoutEffect(() => {
    updateCandlestickChannels();

    return realtime();
  }, [updateCandlestickChannels, realtime]);

  // on indicators
  useLayoutEffect(() => {
    const klines = klineChannels.current[interval];
    if (!series.current || !klines) return;

    // TODO refactor to plugin and out this
    const markerFactory = new LightWeightMarkerFactory();
    const pricelineFactory = new LightWeightPriceLineFactory();

    series.current.setMarkers([]);
    priceLinesRef.current.forEach((priceLine) =>
      series.current?.removePriceLine(priceLine)
    );

    indicators.forEach((indicator) => {
      try {
        const Indicator = IndicatorValues[indicator];
        const instance = new Indicator();

        const { markers, priceLines } = instance.execute(klines);

        if (markers) {
          series.current?.setMarkers(
            [
              ...series.current.markers(),
              ...markers.map((marker) => markerFactory.createMarker(marker)),
            ].sort((a, b) => +a.time - +b.time)
          );
        }
        if (priceLines) {
          const newPricelines = priceLines.map((priceLine) =>
            series.current?.createPriceLine(
              pricelineFactory.createPriceline(priceLine)
            )
          ) as IPriceLine[];
          priceLinesRef.current = newPricelines;
        }
      } catch (error) {
        console.error('Error on indicator: ', error);
      }
    });
  }, [indicators, interval, klines]);

  return (
    <ChartBase
      options={chartLayoutOptions}
      onTimeRangeChange={onTimeRangeChange}
    >
      <Series
        ref={series}
        data={candelstickChannels.current[interval] || []}
        type='Candlestick'
      />
    </ChartBase>
  );
}
