'use client';

import { createContext, useCallback, useContext, useState } from 'react';
import { IndicatorKeys } from '@/lib/constants/indicator';
const LIVE_BY_DEFAULT = process.env.NODE_ENV === 'production';

export const ChartSettingsContext = createContext<{
  live: boolean;
  indicators: IndicatorKeys[];
  toggleIndicator: (value: IndicatorKeys) => void;
  setLive: (value: boolean) => void;
}>({
  indicators: [],
  toggleIndicator: () => {},
  live: LIVE_BY_DEFAULT,
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
  const [live, setLive] = useState(LIVE_BY_DEFAULT);

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
