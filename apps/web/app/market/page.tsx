import { Container } from '@/components/container';
import { Heading } from '@/components/heading';
import api from '@/lib/api';
import { decodeSearchParamList } from '@/lib/helpers/string';
import { SymbolPagination } from '@/lib/helpers/symbol-pagination';
import { GridSymbols } from './components/grid-symbols';
import { MarketNav } from './components/market-nav';

export default async function Page({
  searchParams: { page, slug, segments },
}: {
  searchParams: {
    page: string;
    slug: string;
    segments: string;
  };
}) {
  const paramPage = Number(page) || 1;
  const paramQuery = slug;
  const paramSegments = decodeSearchParamList(segments || '');

  const pagination = new SymbolPagination(api.market);

  const [marketSegments, symbols] = await Promise.all([
    api.market.getMarketSegments(),
    pagination.getSymbols({
      query: paramQuery,
      segments: paramSegments,
      page: paramPage,
    }),
  ]);

  return (
    <>
      <Heading
        title='Traderforecast is open!'
        subtitle="Here's the market, a list of all the symbols available on the exchange."
      >
        <MarketNav
          selectedSegments={paramSegments}
          segments={marketSegments}
          slug={paramQuery}
        />
      </Heading>
      <Container fluid className='flex-1'>
        <GridSymbols
          symbols={symbols}
          page={paramPage}
          segments={paramSegments}
          query={paramQuery}
        />
      </Container>
    </>
  );
}
