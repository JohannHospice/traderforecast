import { ValidationError, object, number, string, mixed } from 'yup';
import api from '@/lib/api';

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

const schemaOHLC = object().shape({
  startTime: number().required(),
  endTime: number()
    // endTime cant be less than startTime
    .test(
      'is-greater',
      'End time must be greater than start time',
      function (value) {
        return !!value && value > this.parent.startTime;
      }
    )
    // endTime cant be 10 years from now
    .test(
      'is-less',
      'End time must be less than 10 years from now',
      function (value) {
        return !!value && value < Date.now() + 315569520000;
      }
    )
    // endTime cant be more than 2 years from now if this.parent.interval contains m or h
    .test(
      'is-correct-with-interval',
      'End time must be less than 2 years from now with this interval',
      function (value) {
        return (
          !!value &&
          ['m', 'h'].some((i) => this.parent.interval.includes(i)) &&
          value < Date.now() + 63072000000
        );
      }
    )

    .required(),
  slug: string().required(),
  interval: mixed((input): input is IntervalKeys => input)
    .test('is-interval', 'Invalid interval', (input) =>
      ['1m', '5m', '15m', '30m', '1h', '4h', '1d', '1w'].includes(
        input as string
      )
    )
    .required(),
});
