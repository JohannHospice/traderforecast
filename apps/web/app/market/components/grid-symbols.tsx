'use client';
import CardSymbol from '@/components/card-symbol';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { SEARCH_PARAMS } from '@/lib/constants/navigation';
import { useRedirectParams } from '@/lib/hooks/use-redirect-params';
import { useItemsOnScroll } from '@/lib/hooks/useItemsOnScroll';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { useCallback } from 'react';

export function GridSymbols({
  symbols,
  page,
  query,
  segments,
}: {
  symbols: Symbol[];
  page: number;
  query?: string;
  segments?: string[];
}) {
  const { redirectParams } = useRedirectParams();

  const handleLoadMore = useCallback(() => {
    redirectParams(
      { [SEARCH_PARAMS.PAGE]: page + 1 },
      {
        scroll: false,
      }
    );
  }, [page, redirectParams]);

  const items = useItemsOnScroll({
    key: [query, segments].flat(),
    items: symbols,
    offset: 1000,
    onLoadMore: handleLoadMore,
  });

  if (items.length === 0 && symbols.length === 0) {
    return (
      <div className='mt-8 sm:mt-0 sm:mx-0 mx-4'>
        <Alert className=''>
          <ExclamationTriangleIcon className='h-4 w-4' />
          <AlertTitle>No symbols found</AlertTitle>
          <AlertDescription>Try a different search query.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xxl:grid-cols-6 gap-0 sm:gap-4 divide-y-[1px] sm:divide-y-0'>
      {items.map((symbol) => (
        <Link key={symbol.slug} href={`/market/${symbol.slug}`}>
          <CardSymbol
            symbol={symbol}
            className='h-full after:absolute after:inset-0 after:bg-white after:opacity-0 after:transition-opacity hover:after:opacity-5'
          />
        </Link>
      ))}
    </div>
  );
}
