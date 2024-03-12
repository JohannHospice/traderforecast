import type { Metadata } from 'next';
import { Navigation } from '../components/navigation';
import '../styles/globals.css';

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
      <body className='flex flex-col min-h-[100vh] bg-slate-100'>
        <Navigation />
        <div className='p-4 flex flex-col flex-1'>{children}</div>
      </body>
    </html>
  );
}
