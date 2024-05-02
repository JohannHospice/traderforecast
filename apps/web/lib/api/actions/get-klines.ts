'use server';
import api from '@/lib/api/dependancies';
import { GetKlinesAndSymbolUsecase } from '@/lib/api/dependancies/market/usecases/get-klines-and-symbol-usecase';

export async function actionGetKlines({
  slug,
  interval,
  startTime,
}: {
  slug: string;
  interval: string;
  startTime: string;
}) {
  const { symbol, klines } = await new GetKlinesAndSymbolUsecase(
    api.market
  ).execute({
    slug,
    interval: interval as IntervalKeys,
    startTime,
  });

  return klines;
}
