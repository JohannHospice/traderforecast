'use client';

import { cn } from '../lib/tailwind/utils';

export function DotPulse({ pulse }: { pulse?: boolean }) {
  return (
    <span className='relative flex h-2 w-2'>
      <span
        className={cn(
          'animate-ping absolute hidden h-full w-full rounded-full bg-red-400 opacity-75',
          pulse && 'inline-flex'
        )}
      ></span>
      <span
        className={cn(
          'relative inline-flex rounded-full h-2 w-2 bg-slate-500',
          pulse && 'bg-red-500'
        )}
      ></span>
    </span>
  );
}
