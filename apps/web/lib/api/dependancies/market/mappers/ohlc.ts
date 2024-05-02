import dayjs from 'dayjs';

export function mapOhlcToKline(kline: any) {
  return {
    open: parseFloat(kline.openPriceUsd),
    high: parseFloat(kline.highPriceUsd),
    low: parseFloat(kline.lowPriceUsd),
    close: parseFloat(kline.closePriceUsd),
    openTime: dayjs(kline.datetime).valueOf(),
    closeTime: dayjs(kline.datetime).valueOf(),
  };
}
