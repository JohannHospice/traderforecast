'use client';
import { DataTable } from '@/components/data-table';
import {
  createCellNumber,
  createSortButton,
} from '@/components/template-data-table';
import { formatNumber, formatPercent } from '@/lib/helpers/string';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { ColumnDef } from '@tanstack/react-table';
import { useRouter } from 'next/navigation';

export function TableSymbols({ symbols }: { symbols: Symbol[] }) {
  const router = useRouter();

  return (
    <DataTable
      data={symbols}
      columns={
        [
          {
            accessorKey: 'rank',
            header: createSortButton('#', false),
            cell: ({ getValue }) => <div className='ml-4'>{getValue()}</div>,
          },
          {
            accessorKey: 'name',
            accessorFn: (row) => row,
            header: createSortButton('Name', false),
            cell: ({ getValue }) => (
              <div className='flex gap-2 items-center'>
                <div className='w-6 h-6'>
                  <Avatar>
                    <AvatarImage src={getValue().logoUrl} />
                    <AvatarFallback>{getValue().slug}</AvatarFallback>
                  </Avatar>
                </div>
                <div className='flex flex-col'>
                  <div className='text-ellipsis text-nowrap overflow-hidden max-w-[140px]'>
                    {getValue().name}
                  </div>
                  <span className='text-muted-foreground'>
                    {getValue().ticker}
                  </span>
                </div>
              </div>
            ),
          },
          {
            accessorKey: 'price_usd',
            header: createSortButton('Price', true),
            cell: createCellNumber(formatNumber),
          },
          {
            accessorKey: 'marketcap_usd',
            header: createSortButton('Market Cap', true),
            cell: createCellNumber(formatNumber),
          },
          {
            accessorKey: 'volume_usd',
            cell: createCellNumber(formatNumber),
            header: createSortButton('Volume', true),
          },
          {
            accessorKey: 'price_usd_change_1d',
            header: createSortButton('Change (24h)', true),
            cell: createCellNumber(formatPercent, (value) =>
              value > 0 ? 'text-green-500' : 'text-red-500'
            ),
          },
        ] as ColumnDef<Symbol, any>[]
      }
      onRowClick={(row) => router.push(`/symbols/${row.original.slug}`)}
    />
  );
}
