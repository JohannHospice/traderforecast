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
    heading: 'Candle Indicators',
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
    ],
  },
  {
    heading: 'Liquidity Indicators',
    items: [
      {
        value: 'gap',
        label: (
          <>
            <BadgeIndice>G</BadgeIndice> Gap
          </>
        ),
      },
      {
        value: 'unmitigatedfairvaluegap',
        label: (
          <>
            <BadgeIndice>FVG</BadgeIndice> Fair Value Gap
          </>
        ),
      },

      {
        value: 'orderblock',
        label: (
          <>
            <BadgeIndice>OR</BadgeIndice> Order Block
          </>
        ),
      },
    ],
  },
];
