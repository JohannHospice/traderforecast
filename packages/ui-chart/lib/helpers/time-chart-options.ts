import { ColorType, DeepPartial, TimeChartOptions } from 'lightweight-charts';
import { formatNumber } from '@traderforecast/utils/string';

export function createTimeChartOptions({
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
