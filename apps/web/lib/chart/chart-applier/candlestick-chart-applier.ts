'use client';
import { IChartApi, ISeriesApi, SeriesType } from 'lightweight-charts';
import { klineToCandlestick } from '../../helpers/lightweight-charts';
import { ChartApplier } from '.';
import { SerieApplier } from '../serie-applier';

export class CandlestickChartApplier implements ChartApplier {
  // private detector: ChartDetector<T>;
  isLight?: boolean;
  candlestick?: ISeriesApi<SeriesType>;
  chart: IChartApi;
  constructor(chart: IChartApi, isLight?: boolean) {
    this.isLight = isLight;
    this.chart = chart;
  }

  add(klines: Kline[]): ISeriesApi<SeriesType> {
    const candlestick = this.chart.addCandlestickSeries();
    candlestick.setData(klines.map((kline) => klineToCandlestick(kline)));

    if (!this.isLight) {
      candlestick.applyOptions({
        wickUpColor: 'rgb(54, 116, 217)',
        upColor: 'rgb(54, 116, 217)',
        wickDownColor: 'rgb(225, 50, 85)',
        downColor: 'rgb(225, 50, 85)',
        borderVisible: false,
      });
    }

    this.candlestick = candlestick;
    return candlestick;
  }

  apply(serieAppliers: SerieApplier[]) {
    if (this.candlestick === undefined)
      throw new Error('Candlestick not found');

    serieAppliers.forEach((serieApplier) => {
      if (this.candlestick !== undefined) {
        serieApplier.apply(this.candlestick, []);
      }
    });
  }

  update(klines: Kline[]) {
    if (this.candlestick === undefined)
      throw new Error('Candlestick not found');
    this.candlestick.update(klineToCandlestick(klines));
  }
  clear() {
    if (this.candlestick === undefined)
      throw new Error('Candlestick not found');
    this.chart.removeSeries(this.candlestick);
  }
}
