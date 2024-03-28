import { Navigation } from '@/app/components/navigation';
import { ThemeProvider } from '@/components/theme-provider';
import '@/styles/globals.css';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Traderforecast',
  description: 'An application to analyze trading patterns',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang='en' suppressHydrationWarning className='scroll-smooth'>
      <head>
        <link rel='icon' href='/traderforecast.svg' />
        <meta
          name='description'
          content='An application to analyze trading patterns'
        />
        <meta name='author' content='Traderforecast' />
      </head>
      <body className='flex flex-col min-h-[100vh]'>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <Navigation />
          <div className='flex flex-col flex-1 py-4'>{children}</div>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
