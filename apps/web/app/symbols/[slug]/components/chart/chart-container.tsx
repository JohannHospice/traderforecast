import { ChartOptions, DeepPartial, LayoutOptions, TimeChartOptions } from 'lightweight-charts';
import {
  createContext,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
} from 'react';
import { ChartApi } from './api/ChartApi';

export const ChartContext = createContext<ChartApi>({} as ChartApi);
export const ChartContainer = forwardRef(
  (
    {
      children,
      container,
      options
    }: {
      children: React.ReactNode;
      container: HTMLElement;
        options: DeepPartial<ChartOptions>
    },
    ref
  ) => {
    const chartApiRef = useRef(new ChartApi(container, options));

    useLayoutEffect(() => {
      const { current: chartApi } = chartApiRef;
      const api = chartApi.api();

      const handleResize = () => {
        api.applyOptions({
          ...options,
          width: container.clientWidth,
          height: 300,
        });
      };

      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
        chartApi.free();
      };
    }, []);

    useLayoutEffect(() => {
      chartApiRef.current.api().applyOptions(options);
    }, []);

    useEffect(() => {
      const currentRef = chartApiRef.current;
      currentRef.api().applyOptions({ layout: options.layout });
    }, [options.layout]);

    useImperativeHandle(ref, () => chartApiRef.current.api(), []);

    return (
      <ChartContext.Provider value={chartApiRef.current}>
        {children}
      </ChartContext.Provider>
    );
  }
);
ChartContainer.displayName = 'ChartContainer';
