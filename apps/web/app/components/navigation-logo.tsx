'use client';

import { useTheme } from 'next-themes';
import { TraderforecastLogo } from '@/components/icons';
import { cn } from '@/lib/tailwind/utils';

export function NavigationLogo() {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <div className='p-2 flex items-center justify-center gap-2'>
      <TraderforecastLogo
        className={cn('h-6', isLight ? 'fill-black' : 'fill-white')}
      />
      <span
        className={cn(
          'font-medium text-lg hidden sm:flex',
          isLight ? 'text-black' : 'text-white'
        )}
      >
        TraderForecast
      </span>
    </div>
  );
}
