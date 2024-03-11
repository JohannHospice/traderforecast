import { CardSymbol } from '../components/card-symbol';
import api from '../lib/api';

export default async function Page({
  searchParams,
}: {
  searchParams?: { q?: string };
}) {
  const symbols = await api.market.symbols({
    query: searchParams?.q,
  });

  return (
    <div className='flex flex-col gap-4'>
      <h1 className='scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl'>
        Symbols
      </h1>
      <p className='leading-7'>Search for a symbol to view its details.</p>

      {symbols.length === 0 ? (
        <div>No symbols found</div>
      ) : (
        <div className='grid grid-cols-5 grid-rows-5 gap-4'>
          {symbols.map((symbol) => (
            <CardSymbol key={symbol.symbol} symbol={symbol} />
          ))}
        </div>
      )}
    </div>
  );
}
