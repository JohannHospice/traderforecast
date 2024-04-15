import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import * as React from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { DescriptionLabel } from '../description-label';

export function ControlledInput<T extends FieldValues>({
  label,
  placeholder,
  type,
  name,
  control,
  disabled,
  endAdornment,
  required,
  description,
}: {
  label: string;
  type: React.HTMLInputTypeAttribute;
  placeholder?: string;
  name: Path<T>;
  control: Control<T>;
  disabled?: boolean;
  endAdornment?: React.ReactNode;
  required?: boolean;
  description?: string;
}) {
  const formatterByType: Partial<
    Record<React.HTMLInputTypeAttribute, (value: string) => string>
  > = {
    'datetime-local': (value?: string) =>
      value ? format(new Date(value), "yyyy-MM-dd'T'HH:mm") : '',
    text: (value?: string) => value || '',
    number: (value?: string) => String(value),
    time: (value?: string) => value || '',
  };
  const valueFormatter = formatterByType[
    type in formatterByType ? type : 'text'
  ] as (value: string) => string;

  return (
    <Controller
      name={name}
      control={control}
      render={({
        field: { onChange, name, value },
        fieldState: { error },
        formState,
      }) => (
        <div className='flex flex-col flex-1 gap-3'>
          <Label htmlFor={label}>
            {label}
            {required && ' *'}
          </Label>
          <Input
            id={label}
            name={name}
            type={type}
            placeholder={placeholder}
            disabled={disabled}
            value={valueFormatter(value)}
            onChange={onChange}
            endAdornment={endAdornment}
            // defaultValue={
            //   formState.defaultValues && formState.defaultValues[name]
            // }
          />
          {(description || error) && (
            <DescriptionLabel isError={!!error}>
              {error?.message || description}
            </DescriptionLabel>
          )}
        </div>
      )}
    />
  );
}
