'use server';
import api from '@/lib/api';

export async function actionGetOHLCs(options: {
  interval: string;
  slug: string;

  startTime?: number;
  endTime?: number;
}) {
  const klines = await api.cachedMarket.getOHLCs(options);

  return klines;
}
