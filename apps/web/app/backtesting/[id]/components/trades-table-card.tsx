'use client';
import { DataTable } from '@/components/data-table';
import { Card } from '@/components/ui/card';
import { formatNumber } from '@/lib/helpers/string';
import { cn } from '@/lib/tailwind/utils';
import { $Enums } from '@traderforecast/database';
import { format } from 'date-fns';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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
    type: $Enums.TradeType;
    profitLoss: number | null;
  }[];
  className?: string;
}) {
  const colors = {
    [$Enums.TradeStatus.AWAIT]:
      'bg-blue-500 hover:bg-bg-blue-500 text-primary-foreground',
    [$Enums.TradeStatus.OPEN]:
      'bg-yellow-500 hover:bg-yellow-500 text-foreground',
    [$Enums.TradeStatus.SUCCESS]:
      'bg-green-500 hover:bg-green-500 text-primary-foreground',
    [$Enums.TradeStatus.FAILED]:
      'bg-red-500 hover:bg-red-500 text-primary-foreground',
    [$Enums.TradeStatus.CANCELLED]:
      'bg-gray-500 hover:bg-gray-500 text-foreground',
    undefined: 'bg-gray-500 hover:bg-gray-500 text-foreground',
  };
  return (
    <Card noBorder className={cn('flex', className)}>
      <DataTable
        className='flex-1 border-0'
        data={trades}
        columns={[
          {
            header: 'Status',
            accessorKey: 'status',
            cell: ({ renderValue }) => {
              const value = renderValue<$Enums.TradeStatus>();
              return <Badge className={colors[value]}>{value}</Badge>;
            },
          },
          {
            header: 'Type',
            accessorKey: 'type',
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
            header: 'Profit/Loss',
            accessorKey: 'profitLoss',
            cell: ({ renderValue }) => {
              const value = Number(renderValue());
              if (!value) return 'N/A';
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
