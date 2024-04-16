import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import * as React from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { Combobox } from '../combobox';
import { cn } from '../../lib/helpers/tailwind-utils';

export function ControlledSelect<T extends FieldValues>({
  title,
  placeholder,
  options,
  defaultValue,
  name,
  control,
  required,
  description,
}: {
  title: string;
  placeholder: string;
  options: { value: string; label: React.ReactNode; disabled?: boolean }[];
  defaultValue?: string;
  name: Path<T>;
  control: Control<T>;
  required?: boolean;
  description?: string;
}) {
  return (
    <Controller
      name={name}
      control={control}
      render={({
        field: { onChange, name, value, disabled },
        fieldState: { error },
      }) => (
        <div className='flex flex-col gap-3 flex-1'>
          <Label htmlFor={title}>
            {title}
            {required && ' *'}
          </Label>
          <Select
            defaultValue={defaultValue}
            name={name}
            value={value || ''}
            disabled={disabled}
            onValueChange={(value) => onChange(value)}
          >
            <SelectTrigger className='items-start [&_[data-description]]:hidden'>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {(description || error) && (
            <p
              className={cn(
                error ? 'text-red-500' : 'text-gray-500',
                'text-sm '
              )}
              data-description
            >
              {description || error?.message}
            </p>
          )}
        </div>
      )}
    />
  );
}

export function ControlledCombobox<T extends FieldValues>({
  title,
  placeholder,
  options,
  noOptions,
  name,
  search,
  control,
}: {
  title: string;
  placeholder: string;
  search?: string;
  options: { value: string; label: string }[];
  noOptions?: string;
  name: Path<T>;
  control: Control<T>;
}) {
  return (
    <Controller
      name={name}
      control={control}
      render={({
        field: { onChange, value, disabled },
        fieldState: { error },
      }) => (
        <div className='grid gap-3'>
          <Label htmlFor={title}>{title}</Label>
          <Combobox
            options={options}
            placeholder={placeholder}
            noOptions={noOptions}
            search={search}
            disabled={disabled}
            multiple
            values={value}
            onSelect={(value) => {
              onChange(value);
            }}
          />
          {error && (
            <p className='text-red-500 text-sm mt-1' data-description>
              {error.message}
            </p>
          )}
        </div>
      )}
    />
  );
}

Combobox;
