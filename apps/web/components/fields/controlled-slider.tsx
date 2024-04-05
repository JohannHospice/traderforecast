import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import * as React from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

export function ControlledSlider<T extends FieldValues>({
  title,
  options,
  name,
  control,
}: {
  title: string;
  options: string[];
  name: Path<T>;
  control: Control<T>;
}) {
  return (
    <Controller
      name={name}
      control={control}
      render={({
        field: { onChange, name, value, disabled },
        fieldState: { error },
      }) => (
        <div className='grid gap-6'>
          <Label className='flex justify-between' htmlFor={title}>
            {title}
            <span className='text-gray-500'>{value}</span>
          </Label>
          <Slider
            name={name}
            disabled={disabled}
            value={[options.findIndex((v) => v === value)]}
            onValueChange={([value]) => onChange(options[value])}
            max={options.length - 1}
            step={1}
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
