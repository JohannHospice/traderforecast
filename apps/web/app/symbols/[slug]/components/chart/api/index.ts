import {
  AreaSeriesPartialOptions,
  BarSeriesPartialOptions,
  BaselineSeriesPartialOptions,
  CandlestickSeriesPartialOptions,
  HistogramSeriesPartialOptions,
  LineSeriesPartialOptions,
} from 'lightweight-charts';

export type LineOptions =
  | AreaSeriesPartialOptions
  | BaselineSeriesPartialOptions
  | BarSeriesPartialOptions
  | CandlestickSeriesPartialOptions
  | HistogramSeriesPartialOptions
  | LineSeriesPartialOptions;

export type SerieType = 'line' | 'area' | 'bar' | 'candlestick' | 'histogram';
