import CardSymbol from '@/components/card-symbol';
import { Container } from '@/components/container';
import { Card } from '@/components/ui/card';
import { Command } from '@/components/ui/command';
import api from '@/lib/api/';
import { SEARCH_PARAMS } from '@/lib/constants/navigation';
import { redirect } from 'next/navigation';
import { getDefaultNumberOfKlines } from '../../../lib/helpers/klines';
import { formatInterval } from '../../../lib/helpers/utc';
import CardChart from './components/card-chart';
import { CommandChartSettings } from './components/command-chart-settings';
import { GetKlinesAndSymbolUsecase } from '../../../lib/api/usecases/get-klines-and-symbol-usecase';

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

  const { symbol, klines } = await new GetKlinesAndSymbolUsecase(api.market)
    .execute({
      slug: slug,
      interval: interval,
      startTime: startTime,
    })
    .catch((error) => {
      console.error(error);

      return redirect(
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
        <div className='grid grid-cols-[270px_1fr] grid-rows-[auto_1fr] gap-4 gap-y-0 sm:gap-y-4 flex-1'>
          <div className='col-span-2 md:col-span-1 md:flex'>
            <CardSymbol symbol={symbol} className='min-w-[270px]' />
          </div>
          <div className='row-start-2 row-end-3 flex-col hidden md:flex'>
            <Card noBorder className='flex-1 pt-4'>
              <Command className='rounded-xl max-h-[400px] overflow-hidden'>
                <CommandChartSettings />
              </Command>
            </Card>
          </div>
          <div className='md:row-start-1 row-start-2 md:col-start-2 col-start-1 row-end-3 col-end-3 flex sm:border-t-0 border-t-[1px]'>
            <CardChart
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
