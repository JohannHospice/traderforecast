'use client';
import CardSymbol from '@/components/card-symbol';
import { useItemsOnScroll } from '@/lib/hooks/useItemsOnScroll';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { useCallback } from 'react';
import { Alert, AlertDescription, AlertTitle } from '../../components/ui/alert';
import { SEARCH_PARAMS } from '../../lib/constants/navigation';
import { useRedirectWithSearchParams } from '../../lib/hooks/useRedirectWithSearchParams';
import { Container } from '../../components/container';

export function GridSymbols({
  symbols,
  page,
  query,
  segments,
}: {
  symbols: Symbol[];
  page: number;
  query?: string;
  segments?: string;
}) {
  const { redirectWithSearchParams } = useRedirectWithSearchParams();

  const handleLoadMore = useCallback(() => {
    redirectWithSearchParams(
      { [SEARCH_PARAMS.PAGE]: page + 1 },
      {
        scroll: false,
      }
    );
  }, [page, redirectWithSearchParams]);

  const items = useItemsOnScroll({
    key: [query, segments],
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
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xxl:grid-cols-6 gap-4 divide-y-[1px] sm:divide-y-0'>
      {items.map((symbol) => (
        <Link key={symbol.slug} href={`/symbols/${symbol.slug}`}>
          <CardSymbol symbol={symbol} className='h-full' />
        </Link>
      ))}
    </div>
  );
}
