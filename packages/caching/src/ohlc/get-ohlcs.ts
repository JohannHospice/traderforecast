import { GetOHLCsSearchParams } from '.';
import { OHLC } from '.';
import { redis } from '../client';
import { createKey, getKeyElement } from '../helpers/keys';

export async function getOHLCs(
  base: string,
  params: GetOHLCsSearchParams
): Promise<OHLC[]> {
  const ohlcKeys = await getFilteredOHLCKeys(base, params);

  if (ohlcKeys.length === 0) {
    return [];
  }

  const pipeline = redis.pipeline();

  ohlcKeys.forEach((key) => pipeline.hgetall(key));

  return pipeline.exec<OHLC[]>();
}

export async function existsOHLCs(
  base: string,
  params: GetOHLCsSearchParams
): Promise<boolean> {
  const ohlcKeys = await getFilteredOHLCKeys(base, params);
  return ohlcKeys.length > 0;
}

export async function getFilteredOHLCKeys(
  base: string,
  { startTime, endTime, interval, symbol, origin }: GetOHLCsSearchParams
): Promise<string[]> {
  const scan = await redis.scan(0, {
    match: createKey(base, [undefined, symbol, interval, origin]),
  });

  console.log({ scan });

  const keys = await redis.keys(
    createKey(base, [undefined, symbol, interval, origin])
  );

  return keys.filter((key) => {
    const time = +getKeyElement(key, 0);
    return (
      (startTime ? time >= startTime : true) &&
      (endTime ? time <= endTime : true)
    );
  });
}

export async function isMissingOnTimeIntervalOHLCs(
  base: string,
  params: GetOHLCsSearchParams
): Promise<boolean> {
  throw new Error('Not implemented');

  // const { interval } = params;

  // const [amount, unit] = splitInterval(interval);
  // const ohlcKeys = await getFilteredOHLCKeys(base, params);
  // return ohlcKeys.length === 0;
}
