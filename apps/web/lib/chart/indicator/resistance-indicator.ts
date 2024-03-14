import { Indicator, IndicatorResult } from '.';

export class ResistanceIndicator implements Indicator {
  execute(klines: Kline[]): IndicatorResult {
    return {
      priceLines: [
        {
          price: klines[klines.length - 100].close,
          color: 'red',
          title: 'test resistance',
        },
      ],
    };
  }
}
