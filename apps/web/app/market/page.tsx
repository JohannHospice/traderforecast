import { Container } from '@/components/container';
import { Heading } from '@/components/heading';
import api from '@/lib/api';
import { decodeSearchParamList } from '@traderforecast/utils';
import { SymbolPagination } from '@/lib/helpers/symbol-pagination';
import { GridSymbols } from './_components/grid-symbols';
import { MarketNav } from './_components/market-nav';
import { SEARCH_PARAM_ARRAY_SEPARATOR } from '../../lib/constants/navigation';

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
  const paramSegments = decodeSearchParamList(
    segments || '',
    SEARCH_PARAM_ARRAY_SEPARATOR
  );

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
        title='Market'
        subtitle="Here's the market, a list of all the symbols available on the exchange."
      />
      <Container fluid className='flex-1'>
        <MarketNav
          selectedSegments={paramSegments}
          segments={marketSegments}
          slug={paramQuery}
        />
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
