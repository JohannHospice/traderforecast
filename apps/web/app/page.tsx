import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import api from '@/lib/api';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { redirect } from 'next/navigation';
import { SEARCH_PARAMS, SYMBOL_VIEWS } from '../lib/constants/navigation';
import { formatArrayInSearchParam } from '../lib/helpers/string';
import { GridSymbols } from './components/grid-symbols';
import { MarketNav } from './components/market-nav';
import { TableSymbols } from './components/table-symbols';

export default async function Page({
  searchParams,
}: {
  searchParams: Record<SEARCH_PARAMS, string>;
}) {
  if (searchParams[SEARCH_PARAMS.VIEWS] === undefined) {
    return redirect(`?${SEARCH_PARAMS.VIEWS}=${SYMBOL_VIEWS.TABLE}`);
  }
  const symbols = await api.market.symbols({
    query: searchParams[SEARCH_PARAMS.QUERY],
    segments: formatArrayInSearchParam(
      searchParams[SEARCH_PARAMS.SEGMENTS] || ''
    ),
  });

  const isEmpty = symbols.length === 0;
  const isGrid = searchParams[SEARCH_PARAMS.VIEWS] === SYMBOL_VIEWS.GRID;
  const segments = Array.from(
    symbols.reduce((acc, symbol) => {
      symbol.market_segments?.forEach((segment) => {
        acc.add(segment);
      });
      return acc;
    }, new Set<string>())
  );

  return (
    <div className='flex flex-col gap-4'>
      <h1 className='scroll-m-20 text-lg font-extrabold tracking-tight lg:text-4xl'>
        The Market is open!
      </h1>
      <p className='leading-7 text-gray-500'>
        Here's a list of all the symbols available on the exchange.
      </p>
      <MarketNav segments={segments} />
      {isEmpty ? (
        <Alert>
          <ExclamationTriangleIcon className='h-4 w-4' />
          <AlertTitle>No symbols found</AlertTitle>
          <AlertDescription>Try a different search query.</AlertDescription>
        </Alert>
      ) : isGrid ? (
        <GridSymbols symbols={symbols} />
      ) : (
        <TableSymbols symbols={symbols} />
      )}
    </div>
  );
}
