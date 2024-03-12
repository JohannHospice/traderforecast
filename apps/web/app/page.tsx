import { Cross1Icon, ExclamationTriangleIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import CardSymbol from '@/components/card-symbol';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import api from '@/lib/api';
import { SEARCH_PARAMS_LIST_SYMBOLS, SYMBOL_VIEWS } from './constants';
import { TableSymbols } from './ui/table-symbols';
import { SwitchView } from './ui/switch-view';
import { redirect } from 'next/navigation';

export default async function Page({
  searchParams,
}: {
  searchParams: Record<SEARCH_PARAMS_LIST_SYMBOLS, string>;
}) {
  if (searchParams[SEARCH_PARAMS_LIST_SYMBOLS.VIEWS] === undefined) {
    return redirect(
      `?${SEARCH_PARAMS_LIST_SYMBOLS.VIEWS}=${SYMBOL_VIEWS.TABLE}`
    );
  }

  const symbols = await api.market.symbols({
    query: searchParams[SEARCH_PARAMS_LIST_SYMBOLS.QUERY],
  });

  const isEmpty = symbols.length === 0;
  const isGrid =
    searchParams[SEARCH_PARAMS_LIST_SYMBOLS.VIEWS] === SYMBOL_VIEWS.GRID;

  return (
    <div className='flex flex-col gap-4'>
      <h1 className='scroll-m-20 text-lg font-extrabold tracking-tight lg:text-4xl'>
        The Market is open for you
      </h1>
      <p className='leading-7 text-gray-500'>
        Here's a list of all the symbols available on the exchange.
      </p>
      {/* <p>
        {Array.from(
          symbols.reduce((acc, symbol) => {
            symbol.market_segments?.forEach((segment) => {
              acc.add(segment);
            });
            return acc;
          }, new Set())
        ).join(', ')}
      </p> */}
      <div className='self-end'>
        <SwitchView />
      </div>

      {isEmpty ? (
        <Alert>
          <ExclamationTriangleIcon className='h-4 w-4' />
          <AlertTitle>No symbols found</AlertTitle>
          <AlertDescription>Try a different search query.</AlertDescription>
        </Alert>
      ) : isGrid ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
          {symbols.map((symbol) => (
            <Link key={symbol.slug} href={`/symbols/${symbol.slug}`}>
              <CardSymbol symbol={symbol} />
            </Link>
          ))}
        </div>
      ) : (
        <TableSymbols symbols={symbols} />
      )}
    </div>
  );
}
