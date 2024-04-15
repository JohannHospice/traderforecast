import * as React from 'react';
import { cn } from '../lib/tailwind/utils';

export function DescriptionLabel({
  isError,
  children,
}: {
  isError?: boolean;
  children: React.ReactNode;
}) {
  return (
    <p
      className={cn(isError ? 'text-red-500' : 'text-gray-500', 'text-sm ')}
      data-description
    >
      {children}
    </p>
  );
}
