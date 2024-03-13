'use client';

import { useRedirectWithSearchParams } from '@/lib/hooks/useRedirectWithSearchParams';
import { GridIcon, TableIcon } from '@radix-ui/react-icons';
import { SEARCH_PARAMS, SYMBOL_VIEWS } from '@/lib/constants/navigation';
import { GroupButton } from '@/components/group-button';

export function SwitchView() {
  const { searchParams, redirectWithSearchParams } =
    useRedirectWithSearchParams();

  return (
    <GroupButton
      defaultValue={searchParams.get(SEARCH_PARAMS.VIEWS)}
      tabs={[
        {
          value: SYMBOL_VIEWS.TABLE,
          label: <TableIcon className='h-4 w-4' />,
          onClick: () => {
            redirectWithSearchParams({
              [SEARCH_PARAMS.VIEWS]: SYMBOL_VIEWS.TABLE,
            });
          },
        },
        {
          value: SYMBOL_VIEWS.GRID,
          label: <GridIcon className='h-4 w-4' />,
          onClick: () => {
            redirectWithSearchParams({
              [SEARCH_PARAMS.VIEWS]: SYMBOL_VIEWS.GRID,
            });
          },
        },
      ]}
    />
  );
}
