import { ISeriesApi, SeriesType } from 'lightweight-charts';
import {
  createContext,
  forwardRef,
  useContext,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
} from 'react';
import { ChartApi, ChartContext } from './chart-container';
import { LineOptions, SerieType } from './api';

export const SerieContext = createContext({} as SerieApi);

export const Series = forwardRef(function <
  T extends { time: string; value: number },
>(
  {
    children,
    data,
    type,
    options,
  }: {
    children?: React.ReactNode;
    data: T[];
    type: SerieType;
    options: LineOptions;
  },
  ref: React.Ref<ISeriesApi<SeriesType>>
) {
  const chartApiRef = useContext(ChartContext);

  const serieApiRef = useRef(new SerieApi(chartApiRef, options, data, type));

  useLayoutEffect(() => {
    const { current: serieApi } = serieApiRef;
    serieApi.api();
    return () => serieApi.free();
  }, []);

  useLayoutEffect(() => {
    serieApiRef.current.api().applyOptions(options);
  }, [options]);

  useImperativeHandle(ref, () => serieApiRef.current.api(), []);

  return (
    <SerieContext.Provider value={serieApiRef.current}>
      {children}
    </SerieContext.Provider>
  );
});
Series.displayName = 'Series';

export class SerieApi<T extends { time: string; value: number }[] = any> {
  serieApi: ISeriesApi<SeriesType> | null = null;

  constructor(
    private chartApi: ChartApi,
    private lineOptions: LineOptions,
    private data: T,
    private type: SerieType
  ) {}

  api() {
    if (!this.serieApi) {
      this.serieApi = this.addSeries();
      this.serieApi.setData(this.data);
    }
    return this.serieApi;
  }

  free() {
    if (!this.serieApi || this.chartApi.isRemoved) {
      return;
    }
    this.chartApi.freeSerie(this.serieApi);
    this.serieApi = null;
  }

  private get addSeries() {
    const api = this.chartApi.api();
    const actions = {
      line: () => api.addLineSeries(this.lineOptions),
      area: () => api.addAreaSeries(this.lineOptions),
      candlestick: () => api.addCandlestickSeries(this.lineOptions),
      bar: () => api.addBarSeries(this.lineOptions),
      histogram: () => api.addHistogramSeries(this.lineOptions),
    };

    return actions[this.type];
  }
}
