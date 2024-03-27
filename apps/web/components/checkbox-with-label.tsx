import { Checkbox } from '@/components/ui/checkbox';

export function CheckboxWithLabel({
  id,
  label,
  checked,
  onCheckedChange,
}: {
  id?: string;
  label: string;
  checked?: boolean;
  onCheckedChange?: (value: boolean) => void;
}) {
  return (
    <div className='items-center flex space-x-2'>
      <Checkbox id={id} checked={checked} onCheckedChange={onCheckedChange} />
      <label
        htmlFor={id}
        className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
      >
        {label}
      </label>
    </div>
  );
}
