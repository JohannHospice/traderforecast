import api from '@/lib/api';
import { SEARCH_PARAMS } from '@/app/constants/navigation';

export const dynamic = 'force-dynamic'; // defaults to auto

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  console.log('GET:lastKline');

  const { searchParams } = new URL(request.url);
  const interval = searchParams.get(SEARCH_PARAMS.INTERVAL);

  if (!interval) {
    return new Response('Interval is required', { status: 400 });
  }

  const kline = await api.market.lastKline({ slug: params.slug, interval });

  return new Response(JSON.stringify(kline), {
    headers: {
      'content-type': 'application/json',
    },
  });
}
