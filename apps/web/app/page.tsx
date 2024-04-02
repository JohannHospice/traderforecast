import api from '@/lib/api';
import { SEARCH_PARAMS } from '@/lib/constants/navigation';
import { decodeSearchParamList } from '@/lib/helpers/string';
import { Container } from '../components/container';
import { GridSymbols } from './components/grid-symbols';
import { MarketNav } from './components/market-nav';
import { SymbolPagination } from '../lib/helpers/symbol-pagination';
import { Heading } from '../components/heading';

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
      <Heading
        title='Traderforecast is open!'
        subtitle="Here's the market, a list of all the symbols available on the exchange."
      >
        <MarketNav segments={allSegments} />
      </Heading>
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
