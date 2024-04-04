import * as React from 'react';

export function CardWrapper({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <fieldset className='grid gap-6 rounded-lg sm:border p-4 bg-transparent sm:bg-card border-0'>
      <legend className='-ml-1 px-1 text-sm font-medium'>{title}</legend>
      <div className='flex flex-col gap-6'>{children}</div>
    </fieldset>
  );
}

export function SelectStrategyLabel({
  title,
  titleBold,
  description,
  icon: Icon,
}: {
  title: string;
  titleBold: string;
  description: string;
  icon: React.ExoticComponent<any>;
}) {
  return (
    <div className='flex items-start gap-3 text-muted-foreground'>
      <Icon className='size-5' />
      <div className='grid gap-0.5'>
        <p>
          {title}{' '}
          <span className='font-medium text-foreground'>{titleBold}</span>
        </p>
        <p className='text-xs' data-description>
          {description}
        </p>
      </div>
    </div>
  );
}
