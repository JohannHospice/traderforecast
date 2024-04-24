'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ChartSettingsProvider } from '@traderforecast/ui-chart';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ChartSettingsProvider>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ChartSettingsProvider>
  );
}

const queryClient = new QueryClient();
