import { createTimeChartOptions } from '../lib/helpers/time-chart-options';

export const THEME_LIGHT = {
  chartOptions: createTimeChartOptions({
    bgColor: 'transparent',
    textColor: 'hsl(224 71.4% 4.1%)',
    lineColor: 'hsl(0deg 0% 0% / 10.2%)',
    scaleColor: 'transparent',
  }),
  seriesOptions: {
    wickUpColor: '#26a69a',
    upColor: '#26a69a',
    wickDownColor: '#ef5350',
    downColor: '#ef5350',
    borderVisible: false,
  },
};

export const THEME_DARK = {
  chartOptions: createTimeChartOptions({
    bgColor: 'transparent',
    textColor: 'hsl(210 20% 98%)',
    lineColor: 'hsl(0deg 0% 100% / 10.2%)',
    scaleColor: 'transparent',
    // 'hsl(215 27.9% 16.9%)'
  }),
  seriesOptions: {
    wickUpColor: 'rgb(54, 116, 217)',
    upColor: 'rgb(54, 116, 217)',
    wickDownColor: 'rgb(225, 50, 85)',
    downColor: 'rgb(225, 50, 85)',
    borderVisible: false,
  },
};
