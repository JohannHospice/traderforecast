import '../styles/globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Trading patterns',
  description: 'An application to analyze trading patterns',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang='en'>
      <body>{children}</body>
    </html>
  );
}
