import dayjs from 'dayjs';

export function mapOhlc(data: any) {
  return {
    open: parseFloat(data.openPriceUsd),
    high: parseFloat(data.highPriceUsd),
    low: parseFloat(data.lowPriceUsd),
    close: parseFloat(data.closePriceUsd),
    openTime: dayjs(data.datetime).valueOf(),
    closeTime: dayjs(data.datetime).valueOf(),
  };
}
