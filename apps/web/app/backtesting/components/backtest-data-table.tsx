'use client';

import { Backtest } from '@prisma/client';
import { DataTable } from '@/components/data-table';

export function BacktestDataTable({ backtests }: { backtests: Backtest[] }) {
  return (
    <DataTable
      className='bg-card flex-1 flex flex-col'
      columns={[
        {
          header: 'ID',
          accessorKey: 'id',
        },
        {
          header: 'Symbol',
          accessorKey: 'symbol',
          cell: ({ row }) => (
            <div className='capitalize'>{row.getValue('status')}</div>
          ),
        },
        {
          header: 'Strategy',
          accessorKey: 'strategy',
        },
        {
          header: 'Start date',
          accessorKey: 'startDate',
        },
        {
          header: 'End date',
          accessorKey: 'endDate',
        },
        {
          header: 'Trades',
          accessorKey: 'trades',
          cell: ({ row }) => (
            <div>{(row.getValue('trades') as any[]).length}</div>
          ),
        },
      ]}
      data={backtests}
    />
  );
}
