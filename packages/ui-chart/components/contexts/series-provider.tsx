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
import { ChartContext } from './chart-provider';
import { SerieApi } from '../api/serie-api';

export const SerieContext = createContext({} as SerieApi);

export const SeriesProvider = forwardRef(function (
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
SeriesProvider.displayName = 'Series';
