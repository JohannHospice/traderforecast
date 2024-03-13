'use client';

import { DeepPartial, TimeChartOptions } from 'lightweight-charts';
import React, { useEffect, useRef } from 'react';
import { LightWeightChartHandler } from '@/lib/chart/lightweight-chart';

export function LightWeightChart({
  className,
  options,
  onInit,
}: {
  className?: string;
  options?: DeepPartial<TimeChartOptions>;
  onInit: (lightweightChart: LightWeightChartHandler) => void | (() => void);
  onRealTimeUpdate?: (lightweightChart: LightWeightChartHandler) => void;
}) {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (chartContainerRef.current === null) {
      return;
    }
    const { current } = chartContainerRef;

    const lightweightChart = new LightWeightChartHandler(current, options);

    const onDestroy = onInit(lightweightChart);

    return () => {
      if (onDestroy) {
        onDestroy();
      }
      lightweightChart.remove();
    };
  }, [onInit, options]);

  return <div ref={chartContainerRef} className={className} />;
}
