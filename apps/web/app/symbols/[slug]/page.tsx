import CardSymbol from '../../../components/card-symbol';
import api from '../../../lib/api/';

export default async function Page({ params }: { params: { slug: string } }) {
  const { symbol, klines } = await api.market.klines({
    slug: params.slug,
    interval: '1d',
    startTime: 'utc_now-365d',
  });

  return (
    <>
      <CardSymbol symbol={symbol} horizontal />
      {JSON.stringify(klines)}
    </>
  );
}
