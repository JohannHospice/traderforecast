import {
  ISeriesApi,
  SeriesDataItemTypeMap,
  SeriesPartialOptionsMap,
  SeriesType,
  Time,
} from 'lightweight-charts';
import {
  createContext,
  forwardRef,
  useContext,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
} from 'react';
import { ChartApi, ChartContext } from './chart';

export const SerieContext = createContext({} as SerieApi);

export const Series = forwardRef(function (
  {
    children,
    data = [],
    type,
    options = {},
  }: {
    data?: SeriesDataItemTypeMap<Time>[SeriesType][];
    type: SeriesType;
    options?: SeriesPartialOptionsMap[SeriesType];
    children?: React.ReactNode;
  },
  ref: React.Ref<ISeriesApi<SeriesType>>
) {
  const chartApiRef = useContext(ChartContext);

  const serieApiRef = useRef(new SerieApi(chartApiRef, options, data, type));

  useLayoutEffect(() => {
    const { current: serieApi } = serieApiRef;
    return () => serieApi.free();
  }, []);

  useLayoutEffect(() => {
    serieApiRef.current.api().applyOptions(options);
  }, [options]);

  useLayoutEffect(() => {
    serieApiRef.current.api().setData(data);
  }, [data]);

  useImperativeHandle(ref, () => serieApiRef.current.api(), []);

  return (
    <SerieContext.Provider value={serieApiRef.current}>
      {children}
    </SerieContext.Provider>
  );
});
Series.displayName = 'Series';

export class SerieApi {
  private serieApi: ISeriesApi<SeriesType, Time> | null = null;

  constructor(
    private chartApi: ChartApi,
    private lineOptions: SeriesPartialOptionsMap[SeriesType],
    private data: SeriesDataItemTypeMap<Time>[SeriesType][],
    private type: SeriesType
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
    this.chartApi.freeSerie(this.serieApi as any);
    this.serieApi = null;
  }

  private get addSeries() {
    const api = this.chartApi.api();
    const actions = {
      Line: () => api.addLineSeries(this.lineOptions),
      Area: () => api.addAreaSeries(this.lineOptions),
      Candlestick: () => api.addCandlestickSeries(this.lineOptions),
      Bar: () => api.addBarSeries(this.lineOptions),
      Histogram: () => api.addHistogramSeries(this.lineOptions),
      Baseline: () => api.addBaselineSeries(this.lineOptions),
      Custom: () => {
        throw new Error('Custom series is not supported');
      },
    } as unknown as Record<SeriesType, () => ISeriesApi<SeriesType, Time>>;
    return actions[this.type];
  }
}
