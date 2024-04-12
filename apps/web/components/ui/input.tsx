import * as React from 'react';

import { cn } from '@/lib/tailwind/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<
  HTMLInputElement,
  InputProps & { endAdornment: React.ReactNode }
>(({ className, endAdornment, type, ...props }, ref) => {
  return (
    <div className='relative'>
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-card px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:text-input',
          endAdornment ? 'pr-10' : 'pr-3',
          className
        )}
        ref={ref}
        {...props}
      />
      <div className='absolute top-0 bottom-0 right-0 my-auto flex items-center mr-2'>
        {endAdornment}
      </div>
    </div>
  );
});
Input.displayName = 'Input';

export { Input };
