import { ColorType, DeepPartial, TimeChartOptions } from 'lightweight-charts';
import { formatNumber } from '@traderforecast/utils';

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
  lineColor: 'hsl(0deg 0% 0% / 10.2%)',
  scaleColor: 'transparent',
});

export const OPTIONS_DARK = createTimeChartOptions({
  bgColor: 'transparent',
  textColor: 'hsl(210 20% 98%)',
  lineColor: 'hsl(0deg 0% 100% / 10.2%)',
  scaleColor: 'transparent',
});
// 'hsl(215 27.9% 16.9%)'

export const CANDLESTICK_DARK_OPTIONS = {
  wickUpColor: 'rgb(54, 116, 217)',
  upColor: 'rgb(54, 116, 217)',
  wickDownColor: 'rgb(225, 50, 85)',
  downColor: 'rgb(225, 50, 85)',
  borderVisible: false,
};

export const CANDLESTICK_LIGHT_OPTIONS = {
  wickUpColor: '#26a69a',
  upColor: '#26a69a',
  wickDownColor: '#ef5350',
  downColor: '#ef5350',
  borderVisible: false,
};
