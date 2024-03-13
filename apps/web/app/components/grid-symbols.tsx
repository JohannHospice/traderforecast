'use client';
import CardSymbol from '@/components/card-symbol';
import { useItemsOnScroll } from '@/lib/hooks/useItemsOnScroll';
import Link from 'next/link';

export function GridSymbols({ symbols }: { symbols: Symbol[] }) {
  const items = useItemsOnScroll(symbols, 20, 400);

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
      {items.map((symbol) => (
        <Link key={symbol.slug} href={`/symbols/${symbol.slug}`}>
          <CardSymbol symbol={symbol} />
        </Link>
      ))}
    </div>
  );
}
