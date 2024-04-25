'use client';
import { ChartSettingsProvider } from '@traderforecast/ui-chart';

export const ClientChartSettingsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <ChartSettingsProvider>{children}</ChartSettingsProvider>;
};
