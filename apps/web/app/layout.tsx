import type { Metadata } from 'next';
import '@/styles/globals.css';
import { Navigation } from '@/components/navigation';
import { ThemeProvider } from '@/components/theme-provider';

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
    <html lang='en' suppressHydrationWarning>
      <head />
      <body>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <div className='flex flex-col min-h-[100vh]'>
            <Navigation />
            <div className='py-8 px-8 flex flex-col flex-1'>{children}</div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
