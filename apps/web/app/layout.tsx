import { Navigation } from '@/app/components/navigation';
import { ThemeProvider } from '@/components/theme-provider';
import '@/styles/globals.css';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata } from 'next';
import { BackgroundBlob } from '../components/background-blob';

export const metadata: Metadata = {
  title: 'Traderforecast',
  description: 'An application to analyze trading patterns',
  authors: [
    {
      name: 'Johann Hospice',
      url: 'https://johannhospice.linkedin.com',
    },
  ],
  icons: {
    icon: '/traderforecast.svg',
  },
  openGraph: {
    type: 'website',
    url: 'https://traderforecast.vercel.com',
    title: 'Traderforecast',
    siteName: 'Traderforecast',
    description: 'An application to analyze trading patterns',
    images: 'opengraph.svg',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Traderforecast',
    description: 'An application to analyze trading patterns',
    images: {
      url: 'https://traderforecast.com/opengraph.svg',
      alt: 'Traderforecast Logo',
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang='en' suppressHydrationWarning className='scroll-smooth'>
      <head />
      <body className='flex flex-col min-h-[100vh]'>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <Navigation />
          <div className='flex flex-col flex-1 py-4'>{children}</div>
          <BackgroundBlob />
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
