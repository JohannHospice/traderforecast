'use client';
import CardSymbol from '@/components/card-symbol';
import { useItemsOnScroll } from '@/lib/hooks/useItemsOnScroll';
import Link from 'next/link';
import { useEffect } from 'react';
import { useRedirectWithSearchParams } from '../../lib/hooks/useRedirectWithSearchParams';
import { SEARCH_PARAMS } from '../../lib/constants/navigation';

export function GridSymbols({
  symbols,
  page = 1,
}: {
  symbols: Symbol[];
  page?: number;
}) {
  const items = useItemsOnScroll(symbols, 20, 1000);
  const { redirectWithSearchParams } = useRedirectWithSearchParams();

  useEffect(() => {
    if (!page) return;

    if (items.length < symbols.length) return;

    redirectWithSearchParams({ [SEARCH_PARAMS.PAGE]: page + 1 });
  }, [items.length, page, redirectWithSearchParams, symbols.length]);

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 divide-y-[1px] sm:divide-y-0'>
      {items.map((symbol) => (
        <Link key={symbol.slug} href={`/symbols/${symbol.slug}`}>
          <CardSymbol symbol={symbol} noBorder className='h-full' />
        </Link>
      ))}
    </div>
  );
}
