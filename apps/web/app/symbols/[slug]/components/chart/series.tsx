import { ISeriesApi, SeriesType } from 'lightweight-charts';
import {
  createContext,
  forwardRef,
  useContext,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
} from 'react';
import { LineOptions, SerieApi, SerieType } from './api/SerieApi';
import { ChartContext } from './chart-container';

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

  console.log(chartApiRef.isRemoved);
  

  const serieApiRef = useRef(new SerieApi(chartApiRef, options, data, type));

  useLayoutEffect(() => {
    const { current: serieApi } = serieApiRef;
    serieApi.api();
    return () => serieApi.free();
  }, []);

  useLayoutEffect(() => {
    serieApiRef.current.api().applyOptions(options);
  });

  useImperativeHandle(ref, () => serieApiRef.current.api(), []);

  return (
    <SerieContext.Provider value={serieApiRef.current}>
      {children}
    </SerieContext.Provider>
  );
});
Series.displayName = 'Series';
