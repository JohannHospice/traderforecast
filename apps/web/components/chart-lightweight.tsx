'use client';

import { TimeChartOptions } from 'lightweight-charts';
import React, { useEffect, useRef } from 'react';
import { LightWeightChartHandler } from '@/lib/chart/lightweight-chart';
import { DeepPartial } from '@apollo/client/utilities';

export function LightWeightChart({
  onInit,
  className,
  options,
}: {
  onInit: (lightweightChart: LightWeightChartHandler) => void;
  className?: string;
  options?: DeepPartial<TimeChartOptions>;
}) {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (chartContainerRef.current === null) {
      return;
    }
    const { current } = chartContainerRef;

    const lightweightChart = new LightWeightChartHandler(current, options);

    onInit(lightweightChart);

    return () => {
      lightweightChart.remove();
    };
  }, [chartContainerRef, options, onInit]);

  return <div ref={chartContainerRef} className={className} />;
}
