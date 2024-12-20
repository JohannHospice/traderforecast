'use server';
import api from '@/lib/api/dependancies';

export async function actionGetOHLCs(options: {
  interval: string;
  slug: string;

  startTime?: number;
  endTime?: number;
}) {
  const klines = await api.market.getOHLCs(options);

  return klines;
}
