import { ClientChartSettingsProvider } from '@/components/contexts/client-chart-settings-provider';
import { ReactQueryProvider } from '@/components/contexts/react-query-provider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClientChartSettingsProvider>
      <ReactQueryProvider>{children}</ReactQueryProvider>;
    </ClientChartSettingsProvider>
  );
}
