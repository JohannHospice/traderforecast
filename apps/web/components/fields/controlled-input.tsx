import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import * as React from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

export function ControlledInput<T extends FieldValues>({
  label,
  placeholder,
  type,
  name,
  control,
  disabled,
}: {
  label: string;
  type: React.HTMLInputTypeAttribute;
  placeholder?: string;
  name: Path<T>;
  control: Control<T>;
  disabled?: boolean;
}) {
  const formatterByType: Partial<
    Record<React.HTMLInputTypeAttribute, (value: string) => string>
  > = {
    'datetime-local': (value?: string) =>
      value ? format(new Date(value), "yyyy-MM-dd'T'HH:mm") : '',
    text: (value?: string) => value || '',
  };
  const valueFormatter = formatterByType[
    type in formatterByType ? type : 'text'
  ] as (value: string) => string;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, name, value }, fieldState: { error } }) => (
        <div className='grid gap-3'>
          <Label htmlFor={label}>{label}</Label>
          <Input
            id={label}
            name={name}
            type={type}
            placeholder={placeholder}
            disabled={disabled}
            value={valueFormatter(value)}
            onChange={onChange}
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
