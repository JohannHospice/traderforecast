'use client';
import { formatNumber, formatPercent } from '@/lib/helpers/string';
import { cn } from '@/lib/helpers/tailwind-utils';
import { ChevronDown, ChevronUp } from 'lucide-react';

export function ProfitLossTypography({
  value,
  percentage,
}: {
  value: any;
  percentage?: boolean;
}) {
  if (!value) return 'N/A';

  const number = Number(value);
  return (
    <span
      className={cn(
        'flex gap-1 items-center',
        number > 0 ? 'text-green-500' : 'text-red-500'
      )}
    >
      {number > 0 ? (
        <ChevronUp className='h-4 w-4' />
      ) : (
        <ChevronDown className='h-4 w-4' />
      )}
      {percentage
        ? formatPercent(Math.abs(number), 'never')
        : formatNumber(Math.abs(number), 'standard', 2)}
    </span>
  );
}
