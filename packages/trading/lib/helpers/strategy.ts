import { getTimeperiodIncrementInMs } from './timeperiod';
import { ExchangeProxy } from '../exchange-proxy';
import { Symbol } from '..';
import { SerieCandlestickPattern } from '../serie-candlestick-pattern';

export function isTradingHour(
  time: number,
  settings: { startHour: string; endHour: string }
): boolean {
  const date = new Date(time);
  const hour = date.getHours();
  const minutes = date.getMinutes();
  // of format HH:MM
  const { startHour, endHour } = settings;
  const [startHourHour, startHourMinutes] = startHour.split(':').map(Number);
  const [endHourHour, endHourMinutes] = endHour.split(':').map(Number);
  if (startHourHour < endHourHour) {
    return hour >= startHourHour && hour < endHourHour;
  }
  return hour >= startHourHour || hour < endHourHour;
}

export async function createSerie(
  time: number,
  exchange: ExchangeProxy,
  symbol: Symbol
): Promise<SerieCandlestickPattern> {
  const from = time - getTimeperiodIncrementInMs(symbol.timeperiod) * 4;
  const to = time;

  const ohlcs = await exchange.getMarket(symbol).getOHLCs({
    from,
    to,
  });
  return new SerieCandlestickPattern(ohlcs);
}
