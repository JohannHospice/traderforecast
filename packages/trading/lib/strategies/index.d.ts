import { Symbol } from '..';

export interface Strategy<T extends StrategySettings = StrategySettings> {
  settings: T;
  id: string;
  name: string;
  symbol: Symbol;

  onTime(time: number, exchange: ExchangeProxy): Promise<void>;
  getSettingsDefinition(): Record<keyof T, string>;
}
export interface StrategySettings {
  tradingFees: number;
}