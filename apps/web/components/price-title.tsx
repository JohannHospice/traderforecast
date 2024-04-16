import { cn } from '../lib/helpers/tailwind-utils';

export function PriceTitle({
  value,
  title,
  vertical,
}: {
  value?: React.ReactNode;
  title?: React.ReactNode;
  vertical?: boolean;
}) {
  return (
    <div
      className={cn('flex items-baseline gap-2', vertical ? 'flex-col' : '')}
    >
      <span className='text-sm text-muted-foreground'>{title}</span>
      <small className='text-sm font-medium leading-none'>{value}</small>
    </div>
  );
}
