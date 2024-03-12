import { redirect } from 'next/navigation';
import CardSymbol from '@/components/card-symbol';
import api from '@/lib/api/';
import { KlinesChart } from './ui/klines-chart';
import { SEARCH_PARAMS_SYMBOL } from './constants';

export default async function Page({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: Record<SEARCH_PARAMS_SYMBOL, string>;
}) {
  if (searchParams[SEARCH_PARAMS_SYMBOL.INTERVAL] === undefined) {
    return redirect('?i=1d&s=utc_now-365d');
  }

  try {
    const { symbol, klines } = await api.market.klines({
      slug: params.slug,
      interval: searchParams[SEARCH_PARAMS_SYMBOL.INTERVAL],
      startTime: searchParams[SEARCH_PARAMS_SYMBOL.START_TIME],
    });

    return (
      <>
        <CardSymbol className='mb-8' symbol={symbol} horizontal />
        <KlinesChart
          klines={klines}
          intervals={api.market.intervals}
          interval={searchParams[SEARCH_PARAMS_SYMBOL.INTERVAL]}
          slug={params.slug}
        />
      </>
    );
  } catch (e) {
    console.error(e);
    return redirect('/');
  }
}
