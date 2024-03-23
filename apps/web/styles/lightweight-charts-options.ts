'use client';
import { ColorType, DeepPartial, TimeChartOptions } from 'lightweight-charts';
import { formatNumber } from '../lib/helpers/string';

function createTimeChartOptions({
  bgColor,
  textColor,
  lineColor,
  scaleColor,
}: {
  bgColor: string;
  textColor: string;
  lineColor: string;
  scaleColor: string;
}): DeepPartial<TimeChartOptions> {
  return {
    layout: {
      background: {
        type: ColorType.Solid,
        color: bgColor,
      },
      textColor: textColor,
    },
    grid: {
      vertLines: {
        color: lineColor,
      },
      horzLines: {
        color: lineColor,
      },
    },
    timeScale: {
      borderColor: scaleColor,
    },
    rightPriceScale: {
      borderColor: scaleColor,
    },
    localization: {
      priceFormatter: formatNumber,
    },
  };
}

export const OPTIONS_LIGHT = createTimeChartOptions({
  bgColor: 'transparent',
  textColor: 'hsl(224 71.4% 4.1%)',
  lineColor: 'hsl(220 13% 91%)',
  scaleColor: 'transparent',
});

export const OPTIONS_DARK = createTimeChartOptions({
  bgColor: 'transparent',
  textColor: 'hsl(210 20% 98%)',
  lineColor: 'hsl(180 2.86% 6.86%)',
  scaleColor: 'transparent',
});
// 'hsl(215 27.9% 16.9%)'
