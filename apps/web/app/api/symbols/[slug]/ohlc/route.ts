import api from '@/lib/api';
import { SEARCH_PARAMS } from '@/lib/constants/navigation';

export const dynamic = 'force-dynamic'; // defaults to auto

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  console.log('GET:OHLC');

  const { searchParams } = new URL(request.url);
  const interval = searchParams.get(SEARCH_PARAMS.INTERVAL);
  const endTime = parseInt(searchParams.get('endTime') || '');
  const startTime = parseInt(searchParams.get('startTime') || '');

  if (!interval) {
    return new Response('Interval is required', { status: 400 });
  }

  const kline = await api.market.getOHLCs({
    slug: params.slug,
    interval: interval as IntervalKeys,
    endTime: endTime,
    startTime: startTime,
  });

  return new Response(JSON.stringify(kline), {
    headers: {
      'content-type': 'application/json',
    },
  });
}
