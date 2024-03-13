'use client';
import { ColorType, DeepPartial, TimeChartOptions } from 'lightweight-charts';

export const OPTIONS_LIGHT: DeepPartial<TimeChartOptions> = {
  layout: {
    background: {
      type: ColorType.Solid,
      color: 'hsl(0 0% 100%)',
    },
    textColor: 'hsl(224 71.4% 4.1%)',
  },
  grid: {
    vertLines: {
      color: 'hsl(220 13% 91%)',
    },
    horzLines: {
      color: 'hsl(220 13% 91%)',
    },
  },
  timeScale: {
    borderColor: 'hsl(220 13% 91%)',
  },
  rightPriceScale: {
    borderColor: 'hsl(220 13% 91%)',
  },
};
export const OPTIONS_DARK: DeepPartial<TimeChartOptions> = {
  layout: {
    background: {
      type: ColorType.Solid,
      color: 'hsl(224 71.4% 4.1%)',
    },
    textColor: 'hsl(210 20% 98%)',
  },
  grid: {
    vertLines: {
      color: 'hsl(180 2.86% 6.86%)',
    },
    horzLines: {
      color: 'hsl(180 2.86% 6.86%)',
    },
  },
  timeScale: {
    borderColor: 'hsl(215 27.9% 16.9%)',
  },
  rightPriceScale: {
    borderColor: 'hsl(215 27.9% 16.9%)',
  },
};
