import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import * as React from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { DescriptionLabel } from '../description-label';
import { cn } from '../../lib/tailwind/utils';

export function ControlledSlider<T extends FieldValues>({
  title,
  options,
  name,
  control,
  description,
  className,
}: {
  title: string;
  options: string[];
  name: Path<T>;
  control: Control<T>;
  description?: string;
  className?: string;
}) {
  return (
    <Controller
      name={name}
      control={control}
      render={({
        field: { onChange, name, value, disabled },
        fieldState: { error },
      }) => (
        <div className={cn('grid gap-6', className)}>
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
