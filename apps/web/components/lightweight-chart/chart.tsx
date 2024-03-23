import {
  ChartOptions,
  DeepPartial,
  IChartApi,
  ISeriesApi,
  Range,
  SeriesType,
  Time,
  createChart,
} from 'lightweight-charts';
import {
  createContext,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

export function ChartBase(
  props: Omit<React.ComponentProps<typeof ChartContainer>, 'container'>
) {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const handleRef = useCallback((ref: HTMLDivElement | null) => {
    setContainer(ref);
  }, []);

  return (
    <div className={'relative flex flex-1'}>
      <div ref={handleRef} className='absolute top-0 left-0 right-0 bottom-0'>
        {container && <ChartContainer {...props} container={container} />}
      </div>
    </div>
  );
}

export const ChartContext = createContext({} as ChartApi);

const ChartContainer = forwardRef(
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
          height: container.clientHeight,
        });
      };

      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
        chartApi.free();
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useLayoutEffect(() => {
      chartApiRef.current.api().applyOptions(options);
    }, [options]);

    useLayoutEffect(() => {
      const { current: chartApi } = chartApiRef;
      const api = chartApi.api();
      const handleVisibileTimeRangeChange = (time: Range<Time> | null) => {
        if (time === null) {
          return;
        }
        onTimeRangeChange?.(time);
      };

      api
        .timeScale()
        .subscribeVisibleTimeRangeChange(handleVisibileTimeRangeChange);
      return () => {
        api
          .timeScale()
          .unsubscribeVisibleTimeRangeChange(handleVisibileTimeRangeChange);
      };
    }, [onTimeRangeChange]);

    useImperativeHandle(ref, () => chartApiRef.current.api(), []);

    return (
      <ChartContext.Provider value={chartApiRef.current}>
        {children}
      </ChartContext.Provider>
    );
  }
);
ChartContainer.displayName = 'ChartContainer';

export class ChartApi {
  get isRemoved() {
    return this.chartApi === null;
  }

  private chartApi: null | IChartApi = null;

  constructor(
    private container: HTMLElement,
    private options: DeepPartial<ChartOptions>
  ) {}

  api() {
    if (!this.chartApi) {
      this.chartApi = createChart(this.container, {
        ...this.options,
        width: this.container.clientWidth,
        height: this.container.clientHeight,
      });
      this.chartApi.timeScale().fitContent();
    }

    return this.chartApi;
  }

  freeSerie(series?: ISeriesApi<SeriesType, Time>) {
    if (!this.chartApi || !series) {
      return;
    }
    this.chartApi.removeSeries(series);
  }

  free() {
    if (!this.chartApi) {
      return;
    }
    this.chartApi.remove();
    this.chartApi = null;
  }
}