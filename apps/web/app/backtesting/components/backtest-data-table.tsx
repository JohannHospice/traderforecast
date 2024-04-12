'use client';

import { Backtest } from '@prisma/client';
import { DataTable } from '@/components/data-table';
import { format } from 'date-fns';
import { Button } from '../../../components/ui/button';
import Link from 'next/link';

export function BacktestDataTable({ backtests }: { backtests: Backtest[] }) {
  return (
    <DataTable
      className='bg-card flex-1 flex flex-col sm:mx-0 mx-4 sm:mt-0 mt-4'
      columns={[
        {
          header: 'Id',
          accessorKey: 'id',
          cell: ({ row }) => (
            <div className='text-ellipsis overflow-hidden max-w-[80px]'>
              {row.getValue('id')}
            </div>
          ),
        },
        {
          header: 'Symbol',
          accessorKey: 'symbol',
          accessorFn: (row) => row.symbol.id,
        },
        {
          header: 'Strategy',
          accessorKey: 'strategy',
          accessorFn: (row) => row.strategy.id,
        },
        {
          header: 'Start date',
          accessorKey: 'from',
          accessorFn: (row) => format(row.from, "yyyy-MM-dd'T'HH:mm:ss"),
        },
        {
          header: 'End date',
          accessorKey: 'to',
          accessorFn: (row) => format(row.to, "yyyy-MM-dd'T'HH:mm:ss"),
        },
        {
          header: 'Trades',
          accessorKey: 'trades',
          accessorFn: (row) => (row.trades || []).length,
        },
        {
          id: 'actions',
          header: '',
          cell: ({ row }) => (
            <Link href={'backtesting/' + row.getValue('id')}>
              <Button>Open</Button>
            </Link>
          ),
        },
      ]}
      data={backtests}
    />
  );
}
