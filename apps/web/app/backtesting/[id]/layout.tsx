'use client';
import { ChartSettingsProvider } from '@traderforecast/ui-chart';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ChartSettingsProvider>{children}</ChartSettingsProvider>;
}
