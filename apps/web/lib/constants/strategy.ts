import { ICTSilverBulletSettingsForm } from '@/components/forms/ict-silver-bullet-strategy-form';
import { StrategyOptionProps } from '@/components/strategy-option';
import { Symbol } from '@traderforecast/trading';
import { Strategy } from '@traderforecast/trading/lib/strategies';
import { ICTSilverBulletStrategy } from '@traderforecast/trading/lib/strategies/ict-silver-bullet-strategy';
import { Crosshair, Droplets, Rabbit } from 'lucide-react';
import { RefAttributes } from 'react';
import { UseFormHandleSubmit } from 'react-hook-form';
import { StrategySetting } from '../validation/silver-bullet-setting-form';

export const TIME_PERIOD_OPTIONS = ['5m', '15m', '30m', '1h', '4h', '1d', '1w'];

export const STRATEGY_OPTION_PROPS: Record<
  string,
  {
    optionProps: StrategyOptionProps;
    strategy?: new (symbol: Symbol, config: StrategySetting) => Strategy;
    settingsForm?: React.ForwardRefExoticComponent<
      RefAttributes<UseFormHandleSubmit<StrategySetting>>
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
