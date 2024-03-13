'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRedirectWithSearchParams } from '@/lib/hooks/useRedirectWithSearchParams';
import { GridIcon, TableIcon } from '@radix-ui/react-icons';
import { SEARCH_PARAMS, SYMBOL_VIEWS } from '../constants/navigation';

export function SwitchView() {
  const { searchParams, redirectWithSearchParams } =
    useRedirectWithSearchParams();
  return (
    <Tabs defaultValue={searchParams.get(SEARCH_PARAMS.VIEWS) || undefined}>
      <TabsList>
        <TabsTrigger
          value={SYMBOL_VIEWS.TABLE}
          onClick={() => {
            redirectWithSearchParams({
              [SEARCH_PARAMS.VIEWS]: SYMBOL_VIEWS.TABLE,
            });
          }}
        >
          <TableIcon className='h-4 w-4' />
        </TabsTrigger>
        <TabsTrigger
          value={SYMBOL_VIEWS.GRID}
          onClick={() => {
            redirectWithSearchParams({
              [SEARCH_PARAMS.VIEWS]: SYMBOL_VIEWS.GRID,
            });
          }}
        >
          <GridIcon className='h-4 w-4' />
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
