'use client';
import { ISeriesApi } from 'lightweight-charts';
import { LightWeightChartHandler } from '@/lib/chart/lightweight-chart';
import { SEARCH_PARAMS_SYMBOL } from '../constants';

export function realTimeUpdate({
  chart,
  series,
  slug,
  interval,
}: {
  chart: LightWeightChartHandler;
  series: ISeriesApi<'Candlestick'>;
  slug: string;
  interval: string;
}) {
  return setInterval(
    () =>
      fetch(
        `/api/symbols/${slug}/lastKline?${SEARCH_PARAMS_SYMBOL.INTERVAL}=${interval}`
      )
        .then((res) => res.json())
        .then((kline) => {
          series.update(chart.klineToCandlestick(kline));
        }),
    TIMEOUT_INTERVAL
  );
}

const TIMEOUT_INTERVAL = 1000;
