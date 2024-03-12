'use client';
import { DataTable } from '@/components/ui/data-table';
import { Card, CardContent } from '../../components/ui/card';
import { formatNumber } from '../../lib/helpers/string';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { Button } from '../../components/ui/button';
import { CaretSortIcon } from '@radix-ui/react-icons';
import { CellContext } from '@tanstack/react-table';
import { useRouter } from 'next/navigation';

export function GridCardSymbols({ symbols }: { symbols: Symbol[] }) {
  const router = useRouter();
  return (
    <Card className='flex flex-1'>
      <CardContent className='flex flex-col flex-1 p-8 gap-4'>
        <DataTable
          columns={[
            {
              accessorKey: 'rank',
              header: '#',
            },
            {
              accessorKey: 'name',
              header: 'Name',
              accessorFn: (row) => row,
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
          ]}
          data={symbols}
          onRowClick={(row) => router.push(`/symbols/${row.original.slug}`)}
        />
      </CardContent>
    </Card>
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
