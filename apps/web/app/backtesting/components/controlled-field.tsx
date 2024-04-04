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
import { Slider } from '../../../components/ui/slider';

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

export function ControlledSlider({
  title,
  defaultValue,
  options,
}: {
  title: string;
  defaultValue: number;
  options: string[];
}) {
  const [value, setValue] = React.useState(defaultValue);
  return (
    <div className='grid gap-6'>
      <Label className='flex justify-between' htmlFor={title}>
        {title}
        <span className='text-gray-500'>{options[value]}</span>
      </Label>
      <Slider
        value={[value]}
        onValueChange={(a) => setValue(a[0] || defaultValue)}
        defaultValue={[defaultValue]}
        max={options.length - 1}
        step={1}
      />
    </div>
  );
}

export function ControlledInput({
  label,
  placeholder,
  type,
  disabled,
  value,
}: {
  label: string;
  type: React.HTMLInputTypeAttribute;
  placeholder?: string;
  disabled?: boolean;
  value?: string;
}) {
  return (
    <div className='grid gap-3'>
      <Label htmlFor={label}>{label}</Label>
      <Input
        id={label}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        value={value}
      />
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
