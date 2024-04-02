import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import * as React from 'react';

export function ControlledSelect({
  title,
  placeholder,
  options,
  defaultValue,
}: {
  title: string;
  placeholder: string;
  options: { value: string; label: React.ReactNode }[];
  defaultValue?: string;
}) {
  return (
    <div className='grid gap-3'>
      <Label htmlFor={title}>{title}</Label>
      <Select defaultValue={defaultValue}>
        <SelectTrigger className='items-start [&_[data-description]]:hidden'>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export function ControlledInput({
  label,
  placeholder,
  type,
}: {
  label: string;
  placeholder: string;
  type: React.HTMLInputTypeAttribute;
}) {
  return (
    <div className='grid gap-3'>
      <Label htmlFor={label}>{label}</Label>
      <Input id={label} type={type} placeholder={placeholder} />
    </div>
  );
}

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
