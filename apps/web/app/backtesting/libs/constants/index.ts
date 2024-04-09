import { Crosshair, Droplets, Rabbit } from 'lucide-react';
import { StrategyOptionProps } from '../../components/strategy-option';
import { ICTSilverBulletStrategy } from '../../../../lib/backtest/strategies/ict-silver-bullet-strategy';
import { Strategy } from '../../../../lib/backtest/strategies';
import { Symbol } from '../../../../lib/backtest';

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

export type StrategyKeys = 'fvg-in-fvg' | 'order-blocks' | 'ict-silver-bullet';

export const STRATEGIES: Record<
  StrategyKeys,
  new (symbol: Symbol, config: any) => Strategy
> = {
  'fvg-in-fvg': ICTSilverBulletStrategy,
  'order-blocks': ICTSilverBulletStrategy,
  'ict-silver-bullet': ICTSilverBulletStrategy,
};

export const STRATEGY_KEYS = Object.keys(STRATEGIES) as StrategyKeys[];

export const STRATEGY_OPTION_PROPS: Record<StrategyKeys, StrategyOptionProps> =
  {
    'fvg-in-fvg': {
      icon: Rabbit,
      title: 'Fair Value Gap',
      titleBold: 'In Fair Value Gap',
      description: 'Our first and most popular strategy.',
    },
    'order-blocks': {
      icon: Droplets,
      title: 'Order ',
      titleBold: 'Blocks',
      description: 'Trade on bullish order blocks.',
    },
    'ict-silver-bullet': {
      icon: Crosshair,
      title: 'ICT',
      titleBold: 'Silver Bullet',
      description:
        'Trade on certain hours and enter directly on the first fair value gap.',
    },
  };
