'use client';

import { useTheme } from 'next-themes';
import { TraderforecastLogo } from '@/components/icons';
import { cn } from '@/lib/tailwind/utils';

export default function NavigationLogo() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className='p-2 flex items-center justify-center gap-2'>
      <TraderforecastLogo
        className={cn('h-6', isDark ? 'fill-white' : 'fill-black')}
      />
      <span
        className={cn(
          'font-medium text-lg hidden sm:flex leading-none',
          isDark ? 'text-white' : 'text-black'
        )}
      >
        TraderForecast
      </span>
    </div>
  );
}
