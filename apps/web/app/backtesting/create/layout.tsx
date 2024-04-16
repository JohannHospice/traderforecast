import { ReactQueryProvider } from '@/components/contexts/react-query-provider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ReactQueryProvider>{children}</ReactQueryProvider>;
}
