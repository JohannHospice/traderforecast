import Link from 'next/link';
import { Button } from '../../../components/ui/button';
import api from '../../../lib/api/';

export default async function Page({ params }: { params: { slug: string } }) {
  const klines = await api.market.klines({
    symbol: params.slug,
    interval: '1d',
  });

  return (
    <>
      <div>My Post: {params.slug}</div>
      {JSON.stringify(klines)}
    </>
  );
}
