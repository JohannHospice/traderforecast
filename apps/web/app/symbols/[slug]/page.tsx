import { redirect } from 'next/navigation';
import CardSymbol from '../../../components/card-symbol';
import api from '../../../lib/api/';
import { KlinesChart } from './ui/klines-chart';

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

  const { symbol, klines } = await api.market.klines({
    slug: params.slug,
    interval: searchParams[SEARCH_PARAMS_SYMBOL.INTERVAL],
    startTime: searchParams[SEARCH_PARAMS_SYMBOL.START_TIME],
  });

  return (
    <>
      <div className='mb-4'>
        <CardSymbol symbol={symbol} horizontal />
      </div>
      <KlinesChart klines={klines} />
    </>
  );
}

export enum SEARCH_PARAMS_SYMBOL {
  INTERVAL = 'i',
  START_TIME = 's',
}
