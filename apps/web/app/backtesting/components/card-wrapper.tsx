import * as React from 'react';

export function CardWrapper({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <fieldset className='grid gap-6 sm:rounded-xl rounded-none sm:border p-4 bg-transparent sm:bg-card border-0'>
      <legend className='-ml-1 px-1 text-sm font-medium'>{title}</legend>
      <div className='flex flex-col gap-6'>{children}</div>
    </fieldset>
  );
}
