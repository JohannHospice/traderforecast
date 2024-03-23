import CardSymbol from '@/components/card-symbol';
import { Container } from '@/components/container';
import api from '@/lib/api/';
import { SEARCH_PARAMS } from '@/lib/constants/navigation';
import CardChart from './components/card-chart';
import { formatInterval } from '../../../lib/helpers/utc';
import { getDefaultNumberOfKlines } from '../../../lib/helpers/klines';
import { redirect } from 'next/navigation';

export default async function Page({
  params: { slug },
  searchParams,
}: {
  params: { slug: string };
  searchParams: Record<SEARCH_PARAMS, string>;
}) {
  if (
    !searchParams[SEARCH_PARAMS.INTERVAL] ||
    !searchParams[SEARCH_PARAMS.START_TIME]
  ) {
    const interval = '1d';
    return redirect(
      `?${SEARCH_PARAMS.INTERVAL}=${interval}&${SEARCH_PARAMS.START_TIME}=${formatInterval(
        interval,
        getDefaultNumberOfKlines(interval)
      )}`
    );
  }

  const interval = searchParams[SEARCH_PARAMS.INTERVAL] as IntervalKeys;
  console.log({
    interval,
  });
  const startTime = searchParams[SEARCH_PARAMS.START_TIME];

  const intervals = api.market.intervals;

  const { symbol, klines } = await api.market
    .klines({
      slug: slug,
      interval: interval,
      startTime: startTime,
    })
    .catch((err) => {
      console.error(err);
      redirect(
        `?${SEARCH_PARAMS.INTERVAL}=${interval}&${SEARCH_PARAMS.START_TIME}=${formatInterval(
          interval,
          getDefaultNumberOfKlines(interval)
        )}`
      );
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
              slug={slug}
              klines={klines}
              intervals={intervals}
              interval={interval}
              className='flex-1'
            />
          </div>
        </div>
      </Container>
    </>
  );
}
