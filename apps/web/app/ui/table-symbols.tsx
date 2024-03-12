'use client';
import { DataTable } from '@/components/ui/data-table';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { CaretSortIcon } from '@radix-ui/react-icons';
import { useRouter } from 'next/navigation';
import { Button } from '../../components/ui/button';
import { formatNumber } from '../../lib/helpers/string';

export function TableCardSymbols({ symbols }: { symbols: Symbol[] }) {
  const router = useRouter();

  return (
    <>
      <DataTable
        columns={[
          {
            accessorKey: 'rank',
            header: createSortButton('#', false),
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
                <div>
                  <span className=''>{getValue().name}</span>
                  <span className='text-muted-foreground ml-2'>
                    {getValue().ticker}
                  </span>
                </div>
              </div>
            ),
          },
          {
            accessorKey: 'price_usd',
            header: createSortButton('Price', true),
            cell: createCellNumber(),
          },
          {
            accessorKey: 'marketcap_usd',
            header: createSortButton('Market Cap', true),
            cell: createCellNumber(),
          },
          {
            accessorKey: 'volume_usd',
            cell: createCellNumber(),
            header: createSortButton('Volume', true),
          },
          {
            accessorKey: 'market_segments',
            header: createSortButton('Market Segments', true),
            cell: ({ getValue }: any) => (
              <div className='text-right'>
                {(getValue() as unknown as string[]).join(', ')}
              </div>
            ),
          },
        ]}
        data={symbols}
        onRowClick={(row) => router.push(`/symbols/${row.original.slug}`)}
      />
    </>
  );
}

function createCellNumber() {
  return ({ getValue }: any) => (
    <div className='text-right'>
      {formatNumber(getValue() as unknown as number)}
    </div>
  );
}

function createSortButton(title: string, isRight?: boolean) {
  return ({ column }: any) => (
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
}
