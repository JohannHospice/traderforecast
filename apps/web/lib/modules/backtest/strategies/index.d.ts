import { Symbol } from '..';

export class Strategy {
  onTime(time: number, exchange: ExchangeProxy): Promise<void>;
}
