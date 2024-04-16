import { CandlestickData, Time } from 'lightweight-charts';
import { millisecondsToTime } from '@/lib/helpers/unit';

export function klineToCandlestick(kline: Kline): CandlestickData<Time> {
  return {
    time: millisecondsToTime(kline.closeTime),
    open: kline.open,
    high: kline.high,
    low: kline.low,
    close: kline.close,
  };
}

export function millisecondsToTime(milliseconds: number): Time {
  return (milliseconds / 1000) as Time;
}
