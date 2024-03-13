import { SEARCH_PARAMS } from '@/lib/constants/navigation';
import CardSymbol from '@/components/card-symbol';
import api from '@/lib/api/';
import { redirect } from 'next/navigation';
import CandelstickChart from './ui/candelstick-chart';

export default async function Page({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: Record<SEARCH_PARAMS, string>;
}) {
  if (searchParams[SEARCH_PARAMS.INTERVAL] === undefined) {
    return redirect(
      `?${SEARCH_PARAMS.INTERVAL}=1d&${SEARCH_PARAMS.START_TIME}=utc_now-365d`
    );
  }

  const { symbol, klines } = await api.market.klines({
    slug: params.slug,
    interval: searchParams[SEARCH_PARAMS.INTERVAL],
    startTime: searchParams[SEARCH_PARAMS.START_TIME],
  });

  return (
    <>
      <h1 className='scroll-m-20 text-lg font-extrabold tracking-tight lg:text-4xl'>
        {symbol.name} Chart
      </h1>
      <p className='leading-7 text-gray-500'>
        {symbol.name} is a trading pair available on the exchange.
      </p>

      <div className='grid grid-cols-[auto_1fr] grid-rows-[auto_1fr] gap-y-4 flex-1 '>
        <div className='col-span-2'>
          <CardSymbol className='my-8' symbol={symbol} horizontal />
        </div>
        <div className='row-start-2 gap-4 flex flex-col'>
          {/* todo sidemenu */}
        </div>
        <div className='row-start-2 flex'>
          <CandelstickChart
            klines={klines}
            intervals={api.market.intervals}
            interval={searchParams[SEARCH_PARAMS.INTERVAL]}
            slug={params.slug}
            className='flex-1'
          />
        </div>
      </div>
    </>
  );
}
