'use client';
import { CaretSortIcon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';

export function createCellNumber<T extends { getValue: () => any }>(
  formatNumber: (value: string | number | undefined) => string,
  getClassName?: (value: any) => string
) {
  return function CellNumber(param: T) {
    return (
      <div
        className={
          'text-right ' + (getClassName && getClassName(param.getValue()))
        }
      >
        {formatNumber(param.getValue() as unknown as number)}
      </div>
    );
  };
}

export function createSortButton(title: string, isRight?: boolean) {
  return function SortButton({ column }: any) {
    return (
      <div className={isRight ? 'text-right' : 'text-left'}>
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {title}
          <CaretSortIcon className='ml-2 h-4 w-4' />
        </Button>
      </div>
    );
  };
}
