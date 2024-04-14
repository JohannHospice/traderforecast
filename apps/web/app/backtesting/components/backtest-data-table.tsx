'use client';

import { DataTable } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { formatNumber } from '@/lib/helpers/string';
import { format } from 'date-fns';
import Link from 'next/link';

export function BacktestDataTable({ backtests }: { backtests: any[] }) {
  return (
    <DataTable
      className='bg-card flex-1 flex flex-col sm:mx-0 mx-4 sm:mt-0 mt-4'
      columns={[
        {
          header: 'Strategy',
          accessorKey: 'strategy',
          accessorFn: (row) => row.strategy.id,
        },
        {
          header: 'Symbol',
          accessorKey: 'symbol',
          accessorFn: (row) => row.symbol.id,
        },
        {
          header: 'Start date',
          accessorKey: 'from',
          accessorFn: (row) => format(row.from, 'yyyy-MM-dd HH:mm'),
        },
        {
          header: 'End date',
          accessorKey: 'to',
          accessorFn: (row) => format(row.to, 'yyyy-MM-dd HH:mm'),
        },
        {
          header: 'Initial wallet amount',
          accessorKey: 'initialWalletAmount',
          accessorFn: (row) => formatNumber(row.initialWalletAmount),
        },
        {
          header: 'Final wallet amount',
          accessorKey: 'finalWalletAmount',
          accessorFn: (row) => formatNumber(row.finalWalletAmount),
        },
        {
          header: 'Trades',
          accessorKey: 'trades',
          accessorFn: (row) => row._count.trades,
        },
        {
          id: 'actions',
          header: '',
          cell: ({ row }) => (
            <Link href={'backtesting/' + row.original.id}>
              <Button variant={'link'}>Open</Button>
            </Link>
          ),
        },
      ]}
      data={backtests}
    />
  );
}
