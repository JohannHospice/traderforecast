import { Symbol } from '@/lib/modules/backtest';
import { Strategy } from '@/lib/modules/backtest/strategies';
import {
  ICTSilverBulletStrategy,
  ICTSilverBulletStrategySettings,
} from '@/lib/modules/backtest/strategies/ict-silver-bullet-strategy';
import { Crosshair, Droplets, Rabbit } from 'lucide-react';
import { StrategyOptionProps } from '../../components/strategy-option';

export const optionTimePeriod = [
  '1m',
  '5m',
  '15m',
  '30m',
  '1h',
  '4h',
  '1d',
  '1w',
];

export function createStrategy(
  strategyKey: string,
  symbol: Symbol,
  config: ICTSilverBulletStrategySettings
) {
  const Strategy = STRATEGY_OPTION_PROPS[strategyKey].strategy;
  return new Strategy(symbol, config);
}

export const STRATEGY_OPTION_PROPS: Record<
  string,
  {
    optionProps: StrategyOptionProps;
    strategy: new (
      symbol: Symbol,
      config: ICTSilverBulletStrategySettings
    ) => Strategy;
  }
> = {
  'fvg-in-fvg': {
    strategy: ICTSilverBulletStrategy,
    optionProps: {
      icon: Rabbit,
      title: 'Fair Value Gap',
      titleBold: 'In Fair Value Gap',
      description: 'Our first and most popular strategy.',
      disabled: true,
    },
  },
  'order-blocks': {
    strategy: ICTSilverBulletStrategy,
    optionProps: {
      icon: Droplets,
      title: 'Order ',
      titleBold: 'Blocks',
      description: 'Trade on bullish order blocks.',
      disabled: true,
    },
  },
  [ICTSilverBulletStrategy._id]: {
    strategy: ICTSilverBulletStrategy,
    optionProps: {
      icon: Crosshair,
      title: 'ICT',
      titleBold: 'Silver Bullet',
      description:
        'Trade on certain hours and enter directly on the first fair value gap.',
    },
  },
};

export const STRATEGY_KEYS = Object.keys(STRATEGY_OPTION_PROPS);
