export function PriceTitle({
  value,
  title,
}: {
  value?: React.ReactNode;
  title?: React.ReactNode;
}) {
  return (
    <div className='flex items-baseline gap-2'>
      <span className='text-sm text-muted-foreground'>{title}</span>
      <small className='text-sm font-medium leading-none'>{value}</small>
    </div>
  );
}
