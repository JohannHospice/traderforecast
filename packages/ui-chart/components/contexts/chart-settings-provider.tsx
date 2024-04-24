import { createContext, useCallback, useContext, useState } from 'react';
import { Indicator } from '../../lib/indicators';
import { IndicatorKeys } from '../../lib/constants/indicator';

const LIVE_BY_DEFAULT = process.env.NODE_ENV === 'production';

export const ChartSettingsContext = createContext<{
  live: boolean;
  indicators: IndicatorKeys[];
  toggleIndicator: (value: IndicatorKeys) => void;
  setLive: (value: boolean) => void;
  lock: boolean;
  setLock: (value: boolean) => void;
  customIndicators: Indicator[];
  setCustomIndicators: (value: Indicator[]) => void;
}>({
  indicators: [],
  toggleIndicator: () => {},
  live: LIVE_BY_DEFAULT,
  setLive: () => {},
  lock: false,
  setLock: () => {},
  customIndicators: [],
  setCustomIndicators: () => {},
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
  const [customIndicators, setCustomIndicators] = useState<Indicator[]>([]);
  const [live, setLive] = useState(LIVE_BY_DEFAULT);
  const [lock, setLock] = useState(false);

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
        lock,
        setLock,
        customIndicators,
        setCustomIndicators,
      }}
    >
      {children}
    </ChartSettingsContext.Provider>
  );
}
