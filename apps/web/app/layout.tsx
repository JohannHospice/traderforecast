import '../styles/globals.css';
import type { Metadata } from 'next';
import { Navigation } from '../components/navigation';
import { useRouter } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Trading patterns',
  description: 'An application to analyze trading patterns',
};

export default function RootLayout({
  children,
  searchParams,
}: {
  children: React.ReactNode;
  searchParams?: { q?: string };
}): JSX.Element {
  return (
    <html lang='en'>
      <body>
        <Navigation symbol={searchParams?.q} />
        <div className='p-4'>{children}</div>
      </body>
    </html>
  );
}
