'use client';

import { TraderforecastLogo } from '@/components/icons';
import { cn } from '@/lib/helpers/tailwind-utils';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function NavigationLogo() {
  const { theme } = useTheme();
  // FIXME To fix hydration mismatch https://nextjs.org/docs/messages/react-hydration-error
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    setIsDark(theme === 'dark');
  }, [theme]);

  return (
    <Link href='/' passHref>
      <div className='p-2 flex items-center justify-center gap-2 group'>
        <div className='relative '>
          {/* // after:animate-blob h-[50vh] w-[50vh] after:bg-gradient-to-t after:from-red-500 after:via-orange-500 after:to-blue-500 after:after:opacity-5 after:sm:opacity-10'> */}

          <TraderforecastLogo
            className={cn(
              'h-6 z-10',
              isDark ? 'fill-white' : 'fill-black'
              // on hover create a  red and round ::before element
            )}
          />
          <div className='-z-10 group-hover:opacity-100 opacity-0 transition-opacity absolute inset-0 m-auto bg-gradient-to-t from-red-500 via-orange-500 to-blue-500 animate-blob rounded-[100%] blur-[5px]' />
        </div>

        <span
          className={cn(
            'font-medium text-lg hidden sm:flex leading-none',
            isDark ? 'text-white' : 'text-black'
          )}
        >
          TraderForecast
        </span>
      </div>
    </Link>
  );
}
