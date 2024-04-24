import {
  ChartOptions,
  DeepPartial,
  IChartApi,
  Range,
  Time,
} from 'lightweight-charts';
import {
  createContext,
  forwardRef,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
} from 'react';
import { ChartApi } from '../api/chart-api';

export const ChartContext = createContext({} as ChartApi);
export const ChartProvider = forwardRef(
  (
    {
      children,
      container,
      options,
      onTimeRangeChange,
    }: {
      children: React.ReactNode;
      container: HTMLElement;
      options: DeepPartial<ChartOptions>;
      onTimeRangeChange?: (time: Range<Time>) => void;
    },
    ref: React.Ref<IChartApi>
  ) => {
    const chartApiRef = useRef(new ChartApi(container, options));

    // init chart api
    useLayoutEffect(() => {
      const { current: chartApi } = chartApiRef;
      chartApi.api();
      return () => {
        chartApi.free();
      };
    }, []);

    // setting options and resize event
    useLayoutEffect(() => {
      const { current: chartApi } = chartApiRef;
      const api = chartApi.api();

      api.applyOptions(options);

      const handleResize = () => {
        api.applyOptions({
          ...options,
          width: container.clientWidth,
          height: container.clientHeight,
        });
      };

      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, [container, options]);

    // setting move time range event
    useLayoutEffect(() => {
      const { current: chartApi } = chartApiRef;
      const api = chartApi.api();
      const handleVisibileTimeRangeChange = (time: Range<Time> | null) => {
        if (time === null) {
          return;
        }
        onTimeRangeChange?.(time);
        api.applyOptions({
          width: container.clientWidth,
          height: container.clientHeight,
        });
      };
      const range = api.timeScale().getVisibleRange();
      if (range) onTimeRangeChange?.(range);

      api
        .timeScale()
        .subscribeVisibleTimeRangeChange(handleVisibileTimeRangeChange);
      return () => {
        api
          .timeScale()
          .unsubscribeVisibleTimeRangeChange(handleVisibileTimeRangeChange);
      };
    }, [onTimeRangeChange, container]);

    // expose chart api
    useImperativeHandle(ref, () => chartApiRef.current.api(), []);

    return (
      <ChartContext.Provider value={chartApiRef.current}>
        {children}
      </ChartContext.Provider>
    );
  }
);
ChartProvider.displayName = 'ChartContainer';
