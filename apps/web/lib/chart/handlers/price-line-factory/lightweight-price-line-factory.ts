import { CreatePriceLineOptions } from 'lightweight-charts';
import { PriceLineFactory } from '.';
import { PriceLine } from '../../indicators';

export class LightWeightPriceLineFactory
  implements PriceLineFactory<CreatePriceLineOptions>
{
  createPriceline(param: PriceLine): CreatePriceLineOptions {
    return param;
  }
}
