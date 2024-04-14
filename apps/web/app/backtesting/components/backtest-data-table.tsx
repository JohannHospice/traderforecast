'use client';

import { DataTable } from '@/components/data-table';
import { formatNumber } from '@/lib/helpers/string';
import { format } from 'date-fns';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '../../../lib/tailwind/utils';

export function BacktestDataTable({ backtests }: { backtests: any[] }) {
  const router = useRouter();
  return (
    <DataTable
      className='bg-card flex-1 flex flex-col sm:mx-0 mx-4 sm:mt-0 mt-4'
      onRowClick={({ original }) => router.push('backtesting/' + original.id)}
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
          header: 'Final wallet amount',
          accessorKey: 'finalWalletAmount',
          accessorFn: (row) => formatNumber(row.finalWalletAmount),
        },
        {
          header: 'Profit/Loss',
          accessorKey: 'profitLoss',
          accessorFn: (row) => row.finalWalletAmount - row.initialWalletAmount,
          cell: ({ renderValue }) => {
            const value = renderValue();
            return (
              <span
                className={cn(
                  'flex gap-1',
                  value > 0 ? 'text-green-500' : 'text-red-500'
                )}
              >
                {value > 0 ? (
                  <ChevronUp className='h-4 w-4' />
                ) : (
                  <ChevronDown className='h-4 w-4' />
                )}
                {formatNumber(Math.abs(value), 'standard', 2)}
              </span>
            );
          },
        },
        {
          header: 'Trades',
          accessorKey: 'trades',
          accessorFn: (row) => row._count.trades,
        },
      ]}
      data={backtests}
    />
  );
}
