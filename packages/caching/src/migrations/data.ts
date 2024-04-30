'use strict';
import { OHLC } from '../ohlc';

const fakeSymbols = ['bitcoin', 'ethereum', 'dogecoin', 'cardano', 'solana'];
const fakeIntervals = ['15m', '30m', '1h', '4h', '1d'];
const fakeOrigins = ['santiment', 'binance', 'kucoin', 'coinbase'];

export const data: OHLC[] = Array(50)
  .fill(0)
  .map((_) => {
    const open = Math.random() * 1000;
    const close = Math.random() * 1000;
    const high = Math.max(open, close) + Math.random() * 100;
    const low = Math.min(open, close) - Math.random() * 100;
    const time = Date.now() - Math.random() * 1000 * 60 * 60;

    return {
      openTime: time,
      closeTime: time,
      open,
      close,
      high,
      low,
      symbol: fakeSymbols[Math.floor(Math.random() * fakeSymbols.length)],
      interval: fakeIntervals[Math.floor(Math.random() * fakeIntervals.length)],
      origin: fakeOrigins[Math.floor(Math.random() * fakeOrigins.length)],
    };
  });
