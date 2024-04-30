import { ICTSilverBulletSettingsForm } from '@/components/forms/ict-silver-bullet-strategy-form';
import { StrategyOptionProps } from '@/components/strategy-option';
import { Symbol } from '@traderforecast/trading';
import {
  Strategy,
  StrategySettings,
} from '@traderforecast/trading/lib/strategies';
import { ICTSilverBulletStrategy } from '@traderforecast/trading/lib/strategies/ict-silver-bullet-strategy';
import { ICTUnicornModelStrategy } from '@traderforecast/trading/lib/strategies/ict-unicorn-model-strategy';
import { Crosshair, Droplets, Rabbit, Bone } from 'lucide-react';
import { RefAttributes } from 'react';
import { UseFormHandleSubmit } from 'react-hook-form';

export const TIME_PERIOD_OPTIONS = ['5m', '15m', '30m', '1h', '4h', '1d', '1w'];

export const STRATEGY_OPTION_PROPS: Record<
  string,
  {
    optionProps: StrategyOptionProps;
    strategy?: new (symbol: Symbol, config: StrategySettings) => Strategy;
    settingsForm?: React.ForwardRefExoticComponent<
      RefAttributes<UseFormHandleSubmit<StrategySettings>>
    >;
  }
> = {
  'fvg-in-fvg': {
    optionProps: {
      icon: Rabbit,
      title: 'Fair Value Gap',
      titleBold: 'In Fair Value Gap',
      description: 'Our first and most popular strategy.',
    },
  },
  'order-blocks': {
    optionProps: {
      icon: Droplets,
      title: 'Order ',
      titleBold: 'Blocks',
      description: 'Trade on bullish order blocks.',
    },
  },
  'ict-unicorn-model': {
    strategy: ICTUnicornModelStrategy,
    optionProps: {
      icon: Bone,
      title: 'ICT',
      titleBold: 'Unicorn Model',
      description: 'Trade on bullish and bearish breaker blocks.',
    },
  },
  'ict-silver-bullet': {
    strategy: ICTSilverBulletStrategy,
    settingsForm: ICTSilverBulletSettingsForm,
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
