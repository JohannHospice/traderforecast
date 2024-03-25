'use client';
import { Combobox } from '@/components/combobox';
import { GroupButton } from '@/components/group-button';
import { Checkbox } from '@/components/ui/checkbox';
import { IndicatorKeys, IndicatorOptions } from '@/lib/constants/indicator';
import { SEARCH_PARAMS } from '@/lib/constants/navigation';
import { getNumberOfKlinesResponsive } from '@/lib/helpers/klines';
import { formatInterval } from '@/lib/helpers/utc';
import { useRedirectWithSearchParams } from '@/lib/hooks/useRedirectWithSearchParams';

export function CardChartHeader({
  onSelectMarker,
  intervals = [],
  valuesMarker = [],
  fixed,
  onChangeFixed,
}: {
  intervals?: string[];
  onSelectMarker?: (value: IndicatorKeys) => void;
  valuesMarker?: IndicatorKeys[];
  fixed?: boolean;
  onChangeFixed?: (value: boolean) => void;
}) {
  const { redirectWithSearchParams, searchParams } =
    useRedirectWithSearchParams();

  return (
    <div className='flex gap-4 flex-wrap'>
      <GroupButton
        defaultValue={searchParams.get(SEARCH_PARAMS.INTERVAL)}
        tabs={intervals.map((interval, i) => ({
          value: interval,
          label: interval.toUpperCase(),
          onClick: () => {
            redirectWithSearchParams(
              {
                [SEARCH_PARAMS.START_TIME]: formatInterval(
                  interval,
                  getNumberOfKlinesResponsive()
                ),
                [SEARCH_PARAMS.INTERVAL]: interval,
              },
              {
                scroll: false,
              }
            );
          },
        }))}
      />
      <Combobox
        className='w-full sm:max-w-44 sm:min-w-60'
        placeholder='Select markers...'
        search='Search markers...'
        noOptions='No markers found.'
        values={valuesMarker}
        options={IndicatorOptions}
        onSelect={onSelectMarker}
        multiple
      />

      <div className='items-center flex space-x-2'>
        <Checkbox id='terms1' checked={fixed} onCheckedChange={onChangeFixed} />
        <label
          htmlFor='terms1'
          className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
        >
          Desactivate auto-load
        </label>
      </div>
    </div>
  );
}
