'use client';
import CardSymbol from '@/components/card-symbol';
import Link from 'next/link';

export function GridSymbols({ symbols }: { symbols: Symbol[] }) {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
      {symbols.map((symbol) => (
        <Link key={symbol.slug} href={`/symbols/${symbol.slug}`}>
          <CardSymbol symbol={symbol} />
        </Link>
      ))}
    </div>
  );
}
