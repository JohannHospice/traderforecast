'use client';

import { createContext, useCallback, useContext, useState } from 'react';
import { IndicatorKeys } from '@/lib/constants/indicator';

export const ChartSettingsContext = createContext<{
  live: boolean;
  indicators: IndicatorKeys[];
  toggleIndicator: (value: IndicatorKeys) => void;
  setLive: (value: boolean) => void;
}>({
  indicators: [],
  toggleIndicator: () => {},
  live: true,
  setLive: () => {},
});

export function useChartSettings() {
  return useContext(ChartSettingsContext);
}

export function ChartSettingsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [indicators, setIndicators] = useState<IndicatorKeys[]>([]);
  const [live, setLive] = useState(false);

  const toggleIndicator = useCallback((value: IndicatorKeys) => {
    setIndicators((prev) => {
      const isIndicatorSelected = prev.includes(value);
      return isIndicatorSelected
        ? prev.filter((detector) => detector !== value)
        : [...prev, value];
    });
  }, []);

  return (
    <ChartSettingsContext.Provider
      value={{
        indicators,
        live,
        toggleIndicator,
        setLive,
      }}
    >
      {children}
    </ChartSettingsContext.Provider>
  );
}
