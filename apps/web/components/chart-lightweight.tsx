'use client';

import {
  DeepPartial,
  IChartApi,
  TimeChartOptions,
  createChart,
} from 'lightweight-charts';
import { useEffect, useRef } from 'react';

export function LightWeightChart({
  className,
  options,
  onInit,
}: {
  className?: string;
  options?: DeepPartial<TimeChartOptions>;
  onInit: (chart: IChartApi) => void | (() => void);
}) {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const chart = useRef<IChartApi | null>(null);

  /**
   * FIXME: This is a workaround to fix the chart width when the window is resized
   * Hints:
   * - when the winddow is sized down the chart width is not updated because the element html keeps the same width
   * - this is maybe due to the css grid layout
   */
  const offsetOnResize = useRef<{ x: number; y: number }>();

  useEffect(() => {
    const { current } = chartContainerRef;
    if (current === null) {
      return;
    }

    chart.current = createChart(current, { ...options });
    chart.current.timeScale().fitContent();

    const onDestroy = onInit(chart.current);

    const handleResize = () => {
      if (!offsetOnResize.current) {
        offsetOnResize.current = {
          x: current.clientWidth - window.innerWidth,
          y: current.clientHeight - window.innerHeight,
        };
      }
      chart.current?.applyOptions({
        width: window.innerWidth + offsetOnResize.current.x,
        height: window.innerHeight + offsetOnResize.current.y,
      });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (onDestroy) {
        onDestroy();
      }
      chart.current?.remove();
      window.removeEventListener('resize', handleResize!);
    };
  }, [onInit]);

  useEffect(() => {
    if (options) {
      chart.current?.applyOptions(options);
    }
  }, [options]);

  return <div ref={chartContainerRef} className={className} />;
}
