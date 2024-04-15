'use client';
import { ControlledInput } from '@/components/fields/controlled-input';
import { ControlledSelect } from '@/components/fields/controlled-select';
import { yupResolver } from '@hookform/resolvers/yup';
import { Divide } from 'lucide-react';
import { useEffect, useState } from 'react';
import { UseFormHandleSubmit, useForm } from 'react-hook-form';
import {
  SilverBulletSettingSchemaType,
  silverBulletSettingSchema,
} from '../libs/constants/schema';

const marketHours = {
  london: {
    startHour: '07:00',
    endHour: '16:00',
  },
  new_york: {
    startHour: '12:00',
    endHour: '21:00',
  },
  tokyo: {
    startHour: '00:00',
    endHour: '09:00',
  },
  sydney: {
    startHour: '21:00',
    endHour: '06:00',
  },
};
const marketHoursOptions = [
  {
    value: 'custom',
    label: 'Custom timezone',
  },
  {
    value: 'london',
    label: 'London',
  },
  {
    value: 'new_york',
    label: 'New York',
  },
  {
    value: 'tokyo',
    label: 'Tokyo',
  },
  {
    value: 'sydney',
    label: 'Sydney',
  },
];
export function ICTSilverBulletSettingsForm({
  setSettingHandleSubmit,
}: {
  setSettingHandleSubmit: (
    handleSubmit: () => UseFormHandleSubmit<SilverBulletSettingSchemaType>
  ) => void;
}) {
  const { control, handleSubmit, watch, setValue, trigger } = useForm({
    mode: 'onChange',
    resolver: yupResolver(silverBulletSettingSchema),
    defaultValues: {
      takeProfitRatio: 2,
      stopLossMargin: 0.01,
      tradingFees: 0,
      timezone: 'london',
    },
  });
  const timezone = watch('timezone');

  const [disabledTime, setDisabledTime] = useState(false);

  useEffect(() => {
    setSettingHandleSubmit(() => handleSubmit);
  }, [handleSubmit, setSettingHandleSubmit]);

  useEffect(() => {
    if (timezone && timezone in marketHours) {
      const { startHour, endHour } =
        marketHours[timezone as keyof typeof marketHours];
      setValue('startHour', startHour);
      setValue('endHour', endHour);
      trigger('startHour');
      trigger('endHour');
      setDisabledTime(true);
      return;
    }
    setDisabledTime(false);
  }, [setValue, timezone, trigger]);

  return (
    <>
      <ControlledSelect
        name='timezone'
        control={control}
        title='Timezone'
        placeholder='Select a market hour...'
        options={marketHoursOptions}
        required
        description='The trading market hour to use for the backtest.'
      />
      <div className='gap-4 flex '>
        <div className='flex gap-3 flex-1'>
          <ControlledInput
            name='startHour'
            control={control}
            label='Start Time'
            type='time'
            required
            description='The time period to trade.'
            disabled={disabledTime}
          />
          <ControlledInput
            name='endHour'
            control={control}
            label='End Time'
            type='time'
            required
            disabled={disabledTime}
          />
        </div>
      </div>
      <ControlledInput
        name='takeProfitRatio'
        control={control}
        label='Take Profit Ratio'
        type='number'
        endAdornment={<Divide className='size-5' />}
        required
        description='The ratio to take profit on a trade (e.g. 2 = 2:1).'
      />
      <ControlledInput
        name='stopLossMargin'
        control={control}
        label='Stop Loss Margin'
        type='number'
        endAdornment={<Divide className='size-5' />}
        required
        description='The margin to stop loss on a trade (e.g. 0.01 = 1%).'
      />
      <ControlledInput
        name='tradingFees'
        control={control}
        label='Trading Fees'
        type='number'
        endAdornment={<Divide className='size-5' />}
        required
        description='The trading fees to apply on each trade (e.g. 0.01 = 1%).'
      />
    </>
  );
}
