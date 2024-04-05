'use client';
import { Rabbit } from 'lucide-react';
import { Droplets } from 'lucide-react';

export const strategies = [
  {
    value: 'fvg-in-fvg',
    icon: Rabbit,
    title: 'Fair Value Gap',
    titleBold: 'In Fair Value Gap',
    description: 'Our first and most popular strategy.',
  },
  {
    value: 'order-blocks',
    icon: Droplets,
    title: 'Order ',
    titleBold: 'Blocks',
    description: 'Trade on bullish order blocks.',
  },
];

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

export const optionPairs = [
  { value: 'BTC', label: 'BTC/USD' },
  { value: 'ETH', label: 'ETH/USD' },
  { value: 'BNB', label: 'BNB/USD' },
  { value: 'CRO', label: 'CRO/USD' },
];
