import Link from 'next/link';
import CardSymbol from '../components/card-symbol';
import api from '../lib/api';
import { SwitchGridView } from './ui/switch-grid-view';
import { SEARCH_PARAMS_LIST_SYMBOLS, SYMBOL_VIEWS } from './constants';
import { formatNumber } from '../lib/helpers/string';
import { GridCardSymbols } from './ui/grid-card-symbols';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { Cross1Icon } from '@radix-ui/react-icons';

export default async function Page({
  searchParams,
}: {
  searchParams: Record<SEARCH_PARAMS_LIST_SYMBOLS, string>;
}) {
  const symbols = await api.market.symbols({
    query: searchParams[SEARCH_PARAMS_LIST_SYMBOLS.QUERY],
  });
  const isEmpty = symbols.length === 0;
  const isGrid =
    searchParams[SEARCH_PARAMS_LIST_SYMBOLS.VIEWS] === SYMBOL_VIEWS.GRID;
  console.log('symbols', symbols);

  return (
    <div className='flex flex-col gap-4'>
      <h1 className='scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl'>
        Available Symbols
      </h1>
      <p className='leading-7'>Search for a symbol to view its details.</p>
      <SwitchGridView />
      {isEmpty ? (
        <Alert>
          <Cross1Icon className='h-4 w-4' />
          <AlertTitle>No symbols found</AlertTitle>
          <AlertDescription>Try a different search query.</AlertDescription>
        </Alert>
      ) : isGrid ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
          {symbols.map((symbol) => (
            <Link href={`/symbols/${symbol.slug}`}>
              <CardSymbol key={symbol.slug} symbol={symbol} />
            </Link>
          ))}
        </div>
      ) : (
        <GridCardSymbols symbols={symbols} />
      )}
    </div>
  );
}
