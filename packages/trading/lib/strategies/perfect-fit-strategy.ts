import { ExchangeProxy } from '../exchange-proxy';
import { Strategy, StrategySettings } from '.';
import { Trade } from '../trade';
import { Symbol } from '..';
import { SerieCandlestickPattern } from '@traderforecast/utils/serie-candlestick-pattern';
import { getTimeperiodIncrementInMs } from '../helpers/timeperiod';

/**
 * perfect entry

  - when a fair value gap is in another fair value gap (refering by high/low)
  - add a trade (long or short by the last fairvalue gap type, trend continuation) entry is on the first intersection of fvg
    - tp on last or before low
 */
export class PerfectEntryStrategy
  implements Strategy<PerfectEntryStrategySettings>
{
  readonly id = 'perfect-entry-strategy';
  readonly name = 'Perfect Entry Strategy';

  constructor(
    public symbol: Symbol,
    public settings: PerfectEntryStrategySettings = {}
  ) {}

  async onTime(time: number, exchange: ExchangeProxy): Promise<void> {
    throw new Error('Method not implemented.');
  }

  trade(serie: SerieCandlestickPattern, balance: number): Trade | undefined {
    throw new Error('Method not implemented.');
  }

  getSettingsDefinition(): Record<keyof PerfectEntryStrategySettings, string> {
    return {};
  }
}

export interface PerfectEntryStrategySettings extends StrategySettings {}
