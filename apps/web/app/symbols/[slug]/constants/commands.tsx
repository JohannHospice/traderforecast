import { BadgeIndice } from '@/components/badge-indice';
import { IndicatorKeys } from '@/lib/constants/indicator';

export const COMMAND_GROUP_INDICATORS: {
  heading: React.ReactNode;
  items: {
    value: IndicatorKeys;
    label: React.ReactNode;
    disabled?: boolean;
  }[];
}[] = [
  {
    heading: 'Indicators',
    items: [
      {
        value: 'swinghigh',
        label: (
          <>
            <BadgeIndice>SH</BadgeIndice> Swing High
          </>
        ),
      },
      {
        value: 'swinglow',
        label: (
          <>
            <BadgeIndice>SL</BadgeIndice> Swing Low
          </>
        ),
      },
      {
        value: 'engulfing',
        label: (
          <>
            <BadgeIndice>E</BadgeIndice> Engulfing Candle
          </>
        ),
      },
      {
        value: 'momentum',
        label: (
          <>
            <BadgeIndice>M</BadgeIndice> Momentum Candle
          </>
        ),
      },
      {
        value: 'range',
        label: (
          <>
            <BadgeIndice>R</BadgeIndice> Range Indicator
          </>
        ),
      },
      {
        disabled: true,
        value: 'orderblock' as IndicatorKeys,
        label: (
          <>
            <BadgeIndice>OR</BadgeIndice> Order Block
          </>
        ),
      },
      {
        value: 'fairvaluegap',
        label: (
          <>
            <BadgeIndice>FV</BadgeIndice> Fair Value Gap
          </>
        ),
      },
      {
        value: 'gap',
        label: (
          <>
            <BadgeIndice>G</BadgeIndice> Gap
          </>
        ),
      },
      {
        disabled: true,
        value: 'volumeinbalance',
        label: (
          <>
            <BadgeIndice>VI</BadgeIndice> Volume Inbalance
          </>
        ),
      },
    ],
  },
];
