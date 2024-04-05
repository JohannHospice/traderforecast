import { IndicatorKeys } from '@/lib/constants/indicator';

export const COMMAND_GROUP_INDICATORS: {
  heading: React.ReactNode;
  items: {
    value: IndicatorKeys;
    title: string;
    short?: string;
    disabled?: boolean;
  }[];
}[] = [
  {
    heading: 'Candle Indicators',
    items: [
      {
        value: 'swinghigh',
        title: 'Swing High',
        short: 'SH',
      },
      {
        value: 'swinglow',
        title: 'Swing Low',
        short: 'SL',
      },
      {
        value: 'engulfing',
        title: 'Engulfing Candle',
        short: 'E',
      },
      {
        value: 'momentum',
        title: 'Momentum Candle',
        short: 'M',
      },
    ],
  },
  {
    heading: 'Liquidity Indicators',
    items: [
      {
        value: 'gap',
        title: 'Gap',
        short: 'G',
      },
      {
        value: 'unmitigatedfairvaluegap',
        title: 'Fair Value Gap',
        short: 'FVG',
      },
      {
        value: 'imbalance',
        title: 'Imbalance',
        short: 'IB',
      },
      {
        value: 'orderblock',
        title: 'Order Block',
        short: 'OB',
      },
    ],
  },
];
