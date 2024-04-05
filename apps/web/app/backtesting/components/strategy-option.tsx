import * as React from 'react';

export function StrategyOption({
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
