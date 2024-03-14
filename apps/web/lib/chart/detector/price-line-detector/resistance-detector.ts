'use client';

import { CreatePriceLineOptions } from 'lightweight-charts';
import { ChartDetector } from '..';

export class ResistanceDetector
  implements ChartDetector<CreatePriceLineOptions[]>
{
  execute(klines: Kline[]): CreatePriceLineOptions[] {
    return [{ price: klines[klines.length - 100].close }];
  }
}
