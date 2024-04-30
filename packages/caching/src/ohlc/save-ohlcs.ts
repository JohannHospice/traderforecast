import { OHLC } from '.';
import { redis } from '../client';
import { createKey } from '../helpers/keys';

export async function saveOHLCs(base: string, ohlcs: OHLC[]): Promise<void> {
  console.log('Initializing Redis pipeline');

  const pipeline = redis.pipeline();

  ohlcs.forEach((ohlc) => {
    const key = createKey(base, [
      ohlc.closeTime,
      ohlc.symbol,
      ohlc.interval,
      ohlc.origin,
    ]);

    pipeline.hset(key, ohlc);
  });

  await pipeline.exec();
}

export async function clearOHLCs(base?: string): Promise<void> {
  const keys = await redis.keys(createKey(base));

  if (keys.length === 0) {
    return;
  }

  const pipeline = redis.pipeline();

  keys.forEach((key) => pipeline.del(key));

  await pipeline.exec();
}
