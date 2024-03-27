'use client';
import CardSymbol from '@/components/card-symbol';
import { useItemsOnScroll } from '@/lib/hooks/useItemsOnScroll';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useRedirectWithSearchParams } from '../../lib/hooks/useRedirectWithSearchParams';
import { SEARCH_PARAMS } from '../../lib/constants/navigation';

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

  const [symbolAccumulator, setSymbolAccumulator] = useState<
    Record<string, Symbol[]>
  >({});
  const [accumulatorKey, setAccumulatorKey] = useState<string>('undefined');
  const symbolAccumulatorByKey = useMemo(
    () => (accumulatorKey && symbolAccumulator[accumulatorKey]) || [],
    [accumulatorKey, symbolAccumulator]
  );
  const items = useItemsOnScroll(symbolAccumulatorByKey, 20, 1000, () => {
    // load more
    redirectWithSearchParams(
      { [SEARCH_PARAMS.PAGE]: page + 1 },
      {
        scroll: false,
      }
    );
  });

  useEffect(() => {
    // reset page and key when query or segments change
    const newKey = [query, segments].join('-');

    if (newKey === accumulatorKey) {
      return;
    }

    console.log('new key', { newKey, page: 1 });
    redirectWithSearchParams(
      {
        [SEARCH_PARAMS.PAGE]: 1,
      },
      {
        scroll: false,
      }
    );
    setAccumulatorKey(newKey);
  }, [accumulatorKey, query, redirectWithSearchParams, segments]);

  useEffect(() => {
    setSymbolAccumulator((prev) => {
      if (!accumulatorKey) return prev;
      return {
        ...prev,
        [accumulatorKey]: prev[accumulatorKey]
          ? Array.from(new Set([...prev[accumulatorKey], ...symbols]))
          : symbols,
      };
    });
  }, [symbols, accumulatorKey]);

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 divide-y-[1px] sm:divide-y-0'>
      {items.map((symbol) => (
        <Link key={symbol.slug} href={`/symbols/${symbol.slug}`}>
          <CardSymbol symbol={symbol} noBorder='sm' className='h-full' />
        </Link>
      ))}
    </div>
  );
}
