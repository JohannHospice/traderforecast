'use client';
import { ISeriesApi } from 'lightweight-charts';
import { SEARCH_PARAMS_SYMBOL } from '../page';
import { LightWeightChartHandler } from '../../../../lib/chart/lightweight-chart';

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
