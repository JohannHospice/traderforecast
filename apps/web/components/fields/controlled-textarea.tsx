import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import * as React from 'react';

export function ControlledTextarea({
  title,
  placeholder,
}: {
  title: string;
  placeholder: string;
}) {
  return (
    <div className='grid gap-3'>
      <Label htmlFor={title}>{title}</Label>
      <Textarea
        id={title}
        placeholder={placeholder}
        className='min-h-[9.5rem]'
      />
    </div>
  );
}
