import { ChartSettingsProvider } from '@/lib/contexts/chart-settings-context';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ChartSettingsProvider>{children}</ChartSettingsProvider>;
}
