'use client';

import { DeepPartial, IChartApi, TimeChartOptions } from 'lightweight-charts';
import React, { useEffect, useRef, useState } from 'react';
import { LightWeightChartHandler } from '@/lib/chart/lightweight-chart';

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
  const [handler, setHandler] = useState<LightWeightChartHandler | null>(null);

  useEffect(() => {
    const { current } = chartContainerRef;

    if (current === null) {
      return;
    }

    const handler = new LightWeightChartHandler(current, options);

    setHandler(handler);

    let onDestroy = onInit(handler.chart);

    return () => {
      if (onDestroy) {
        onDestroy();
      }
      if (handler) {
        handler.remove();
      }
    };
  }, [onInit]);

  useEffect(() => {
    if (handler && options) {
      handler.chart.applyOptions(options);
    }
  }, [handler, options]);

  return <div ref={chartContainerRef} className={className} />;
}
