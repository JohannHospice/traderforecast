'use client';
import { DataTable } from '@/components/data-table';
import { Card } from '@/components/ui/card';
import { formatNumber } from '@/lib/helpers/string';
import { cn } from '@/lib/tailwind/utils';
import { $Enums } from '@traderforecast/database';
import { format } from 'date-fns';

export function TradesTableCard({
  trades,
  className,
}: {
  trades: {
    id: string;
    entry: number;
    stopLoss: number | null;
    takeProfit: number;
    entryTime: Date | null;
    exitTime: Date | null;
    status: $Enums.TradeStatus;
  }[];
  className?: string;
}) {
  return (
    <Card className={cn('flex', className)}>
      <DataTable
        className='flex-1'
        data={trades}
        columns={[
          {
            header: 'Status',
            accessorKey: 'status',
          },
          {
            header: 'Entry',
            accessorKey: 'entry',
            accessorFn: (row) => formatNumber(row.entry),
          },
          {
            header: 'Take Profit',
            accessorKey: 'takeProfit',
            accessorFn: (row) => formatNumber(row.takeProfit),
          },
          {
            header: 'Stop Loss',
            accessorKey: 'stopLoss',
            accessorFn: (row) =>
              row.stopLoss ? formatNumber(row.stopLoss) : 'N/A',
          },
          {
            header: 'Profit Loss',
            accessorKey: 'profitLoss',
            accessorFn: (row) =>
              row.profitLoss ? formatNumber(row.profitLoss) : 'N/A',
          },
          {
            header: 'Entry Time',
            accessorKey: 'entryTime',
            accessorFn: (row) =>
              row.entryTime ? format(row.entryTime, 'yyyy-MM-dd HH:mm') : 'N/A',
          },
          {
            header: 'Exit Time',
            accessorKey: 'exitTime',
            accessorFn: (row) =>
              row.exitTime ? format(row.exitTime, 'yyyy-MM-dd HH:mm') : 'N/A',
          },
        ]}
      />
    </Card>
  );
}
