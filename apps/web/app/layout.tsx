import { Navigation } from '@/components/navigation';
import { Pattern } from '@/components/icons';
import { ThemeProvider } from '@/components/contexts/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import '@/styles/globals.css';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Traderforecast',
  description: 'An application to analyze trading patterns',
  metadataBase: new URL('https://traderforecast.vercel.app/'),
  authors: [
    {
      name: 'Johann Hospice',
      url: 'https://www.linkedin.com/in/johannhospice',
    },
  ],
  icons: {
    icon: '/traderforecast.svg',
  },
  openGraph: {
    type: 'website',
    url: 'https://traderforecast.vercel.app/',
    title: 'Traderforecast',
    siteName: 'Traderforecast',
    description: 'An application to analyze trading patterns',
    images: '/opengraph.png',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Traderforecast',
    description: 'An application to analyze trading patterns',
    images: '/opengraph.png',
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
      <body>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <div className='relative overflow-hidden min-h-[100vh]'>
            <Navigation />
            <div className='flex flex-col flex-1 py-4'>{children}</div>
            {/* https://www.hyperflow.co/ */}
            <Pattern className='absolute -top-24 left-0 right-0 w-full -z-10 scale-[3] origin-top opacity-10 sm:opacity-100 blur-lg sm:blur-0' />
          </div>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
        <Toaster />
      </body>
    </html>
  );
}
