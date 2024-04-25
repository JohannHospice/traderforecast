'use client';
import { ControlledInput } from '@/components/fields/controlled-input';
import { ControlledSelect } from '@/components/fields/controlled-select';
import {
  SilverBulletSettingSchemaType,
  silverBulletSettingSchema,
} from '@/lib/validation/silver-bullet-setting-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Divide } from 'lucide-react';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { UseFormHandleSubmit, useForm } from 'react-hook-form';

const marketHours = {
  london_9_10: {
    startHour: '09:00',
    endHour: '10:00',
  },
  new_york_16_17: {
    startHour: '16:00',
    endHour: '17:00',
  },
  new_york_20_21: {
    startHour: '20:00',
    endHour: '21:00',
  },
};
const marketHoursOptions = [
  {
    value: 'custom',
    label: 'Custom timezone',
  },
  {
    value: 'london_9_10',
    label: 'London 9h-10h',
  },
  {
    value: 'new_york_16_17',
    label: 'New York AM 16h-17h',
  },
  {
    value: 'new_york_20_21',
    label: 'New York PM 20h-21h',
  },
];

export const ICTSilverBulletSettingsForm = forwardRef(
  (_, ref: React.Ref<UseFormHandleSubmit<SilverBulletSettingSchemaType>>) => {
    const { control, handleSubmit, watch, setValue, trigger } = useForm({
      mode: 'onChange',
      resolver: yupResolver(silverBulletSettingSchema),
      defaultValues: {
        takeProfitRatio: 2,
        stopLossMargin: 0,
        tradingFees: 0,
        timezone: marketHoursOptions[0].value,
      },
    });
    const timezone = watch('timezone');

    useImperativeHandle(ref, () => handleSubmit, [handleSubmit]);

    const [disabledTime, setDisabledTime] = useState(false);

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
          disabled
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
);
ICTSilverBulletSettingsForm.displayName = 'ICTSilverBulletSettingsForm';
