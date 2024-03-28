import api from '@/lib/api';
import { SEARCH_PARAMS } from '@/lib/constants/navigation';
import { decodeSearchParamList } from '@/lib/helpers/string';
import { Container } from '../components/container';
import { GridSymbols } from './components/grid-symbols';
import { MarketNav } from './components/market-nav';
import { SymbolPagination } from './lib/symbol-pagination';

export default async function Page({
  searchParams,
}: {
  searchParams: Record<SEARCH_PARAMS, string>;
}) {
  const page = Number(searchParams.page) || 1;
  const query = searchParams.slug;
  const segments = decodeSearchParamList(searchParams.segments || '');

  const pagination = new SymbolPagination(api.market);

  const [symbols, allSegments] = await Promise.all([
    pagination
      .load()
      .then(() => pagination.getSymbols({ query, segments, page })),
    api.market.getMarketSegments(),
  ]);

  return (
    <>
      <Container>
        <h1 className='scroll-m-20 text-lg font-extrabold tracking-tight lg:text-4xl'>
          Traderforecast is open!
        </h1>
        <p className='leading-7 text-gray-500'>
          Here&apos;s the market, a list of all the symbols available on the
          exchange.
        </p>
        <MarketNav segments={allSegments} />
      </Container>
      <Container fluid className='flex-1'>
        <GridSymbols
          symbols={symbols}
          page={page}
          segments={searchParams[SEARCH_PARAMS.SEGMENTS]}
          query={query}
        />
      </Container>
    </>
  );
}
