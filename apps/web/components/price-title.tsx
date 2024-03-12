import { formatNumber } from '../lib/helpers/string';

export function PriceTitle({
  value,
  title,
  notation,
}: {
  value?: string | number;
  title?: React.ReactNode;
  notation?: 'standard' | 'scientific' | 'engineering' | 'compact';
}) {
  return (
    <div className='flex items-baseline gap-2'>
      <span className='text-sm text-muted-foreground'>{title}</span>
      <small className='text-sm font-medium leading-none'>
        {value && formatNumber(value, notation)}
      </small>
    </div>
  );
}
