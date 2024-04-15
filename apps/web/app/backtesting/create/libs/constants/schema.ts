import { isBefore, parse } from 'date-fns';
import { InferType, date, number, object, string } from 'yup';
import { STRATEGY_KEYS, optionTimePeriod } from '.';
import { ICTSilverBulletStrategy } from '@/lib/modules/backtest/strategies/ict-silver-bullet-strategy';

export const backtestingSettingsSchema = object()
  .shape({
    strategyKey: string().required().oneOf(STRATEGY_KEYS),
    walletAmount: number()
      .typeError('Amount must be a number')
      .positive("Wallet amount can't be negative.")
      .min(0, "Wallet amount can't be negative.")
      .nonNullable("Wallet amount can't be empty.")
      .required("Wallet amount can't be empty."),
    pair: string().required("Pair can't be empty."),
    timePeriod: string()
      .oneOf(optionTimePeriod)
      .required("Time period can't be empty."),
    endDate: date()
      .test(
        'is-before-now',
        'End date must be in the past.',
        (value) => value && value < new Date()
      )
      .required("End date can't be empty."),
    startDate: date()
      .when(['timePeriod', 'endDate'], ([timePeriod, endDate], schema) => {
        // const minDate = getMinDateByTimePeriod(timePeriod, endDate);
        return (
          schema
            // .min(
            //   minDate,
            //   `Start date can't exceed ${format(minDate, `yyyy-MM-dd HH:mm`)} with the selected time period.`
            // )
            .max(endDate, 'Start date must be before end date.')
        );
      })
      .required("Start date can't be empty."),
  })
  .required();

export type BacktestingSettingsSchemaType = InferType<
  typeof backtestingSettingsSchema
>;

export const silverBulletSettingSchema = object()
  .shape({
    startHour: string()
      .test('not empty', 'Start time cant be empty', function (value) {
        return !!value;
      })
      .required(),
    endHour: string()
      .test('is_time', 'End time must be a valid time', function (value) {
        return (
          !!value &&
          parse(value, 'HH:mm', new Date()).toString() !== 'Invalid Date'
        );
      })
      .required(),
    takeProfitRatio: number().min(0).required(),
    stopLossMargin: number().min(0).required(),
    tradingFees: number().min(0).required(),
    timezone: string(),
  })
  .required();

export type SilverBulletSettingSchemaType = InferType<
  typeof silverBulletSettingSchema
>;

export const settingSchemas = {
  [ICTSilverBulletStrategy._id]: silverBulletSettingSchema,
};
