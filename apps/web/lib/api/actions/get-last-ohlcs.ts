'use server';
import api from '@/lib/api';

export async function actionGetLastOHLC(options: {
  interval: string;
  slug: string;

  startTime?: number;
  endTime?: number;
}) {
  return api.market.getLatestKline({
    interval: options.interval,
    slug: options.slug,
  });
}
