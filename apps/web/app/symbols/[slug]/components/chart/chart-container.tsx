import {
  ChartOptions,
  DeepPartial,
  IChartApi,
  ISeriesApi,
  SeriesType,
  createChart,
} from 'lightweight-charts';
import {
  createContext,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
} from 'react';

export const ChartContext = createContext<ChartApi>({} as ChartApi);
export const ChartContainer = forwardRef(
  (
    {
      children,
      container,
      options,
    }: {
      children: React.ReactNode;
      container: HTMLElement;
      options: DeepPartial<ChartOptions>;
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
    }, []);

    useEffect(() => {
      chartApiRef.current.api().applyOptions(options);
    }, [options]);

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

  chartApi: null | IChartApi = null;

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

  freeSerie(series?: ISeriesApi<SeriesType>) {
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
