import { ValidationError } from 'yup';
import api from '@/lib/api';
import { schemaOHLC } from '../../../../../lib/validation/ohlc-api';

export const dynamic = 'force-dynamic'; // defaults to auto

export async function GET(
  { url }: Request,
  { params: { slug } }: { params: { slug: string } }
) {
  console.log('GET:OHLC');

  const { searchParams } = new URL(url);

  try {
    const param = await schemaOHLC.validate({
      endTime: searchParams.get('endTime'),
      startTime: searchParams.get('startTime'),
      interval: searchParams.get('interval'),
      slug,
    });

    const ohlcs = await api.market.getOHLCs(param);

    const data = JSON.stringify(ohlcs);

    return new Response(data, {
      headers: {
        'content-type': 'application/json',
      },
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      return new Response(error.message, {
        status: 401,
      });
    }

    return new Response('Internal Server Error', {
      status: 400,
    });
  }
}
