import CardSymbol from '@/components/card-symbol';
import { Container } from '@/components/container';
import api from '@/lib/api/';
import { IntervalKeys } from '@/lib/api/repositories/market/santiment-market';
import { SEARCH_PARAMS } from '@/lib/constants/navigation';
import { redirect } from 'next/navigation';
import CardChart from './components/card-chart';

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
      <Container>
        <h1 className='scroll-m-20 text-lg font-extrabold tracking-tight lg:text-4xl'>
          {symbol.name} Chart
        </h1>
        <p className='leading-7 text-gray-500'>
          {symbol.name} is a trading pair available on the exchange.
        </p>
      </Container>
      <Container fluid className='flex-1'>
        <div className='grid grid-cols-[auto_1fr] grid-rows-[auto_1fr] gap-y-0 sm:gap-y-4 flex-1'>
          <div className='col-span-2 sm:flex'>
            <CardSymbol symbol={symbol} noBorder className='min-w-[270px]' />
          </div>
          <div className='row-start-2 gap-4 flex flex-col'>
            {/* todo sidemenu */}
          </div>
          <div className='row-start-2 flex sm:border-t-0 border-t-[1px]'>
            <CardChart
              noBorder
              klines={klines}
              intervals={api.market.intervals}
              interval={searchParams[SEARCH_PARAMS.INTERVAL] as IntervalKeys}
              slug={params.slug}
              className='flex-1'
            />
          </div>
        </div>
      </Container>
    </>
  );
}
