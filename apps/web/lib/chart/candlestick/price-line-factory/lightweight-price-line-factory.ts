import { CreatePriceLineOptions } from 'lightweight-charts';
import { PriceLineFactory } from '.';
import { PriceLine } from '../../indicator';

export class LightWeightPriceLineFactory
  implements PriceLineFactory<CreatePriceLineOptions>
{
  createPriceline(param: PriceLine): CreatePriceLineOptions {
    return param;
  }
}
