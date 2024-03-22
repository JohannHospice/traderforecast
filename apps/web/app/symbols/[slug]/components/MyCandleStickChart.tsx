'use client';
import { CandleStickChart } from '@/components/candlestick-chart';
import { IndicatorKeys } from '@/lib/constants/indicator';
import { useCallback } from 'react';
import { SEARCH_PARAMS } from '../../../../lib/constants/navigation';
import { useRedirectWithSearchParams } from '../../../../lib/hooks/useRedirectWithSearchParams';
import { getNumberOfKlinesResponsive } from '../helper/formatInterval';

export function MyCandleStickChart({
  selectedIndicators,
  klines,
}: {
  selectedIndicators: IndicatorKeys[];
  klines: Kline[];
}) {
  const { searchParams, redirectWithSearchParams } =
    useRedirectWithSearchParams();

  const onLoadMore = useCallback(() => {
    const from = searchParams.get(SEARCH_PARAMS.START_TIME) || '';

    const match = /utc_now-(\d+)(\w)/.exec(from);

    if (!match) {
      return;
    }

    const [_, number, unit] = match;
    const newFrom = `utc_now-${parseInt(number) + getNumberOfKlinesResponsive()}${unit}`;
    console.log({ newFrom });

    redirectWithSearchParams({
      [SEARCH_PARAMS.START_TIME]: newFrom,
    });
    return newFrom;
  }, [searchParams, redirectWithSearchParams]);

  return (
    <CandleStickChart
      selectedIndicators={selectedIndicators}
      klines={klines}
      onLoadMore={onLoadMore}
    />
  );
}
