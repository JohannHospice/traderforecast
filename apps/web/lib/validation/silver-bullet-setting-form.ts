import { parse } from 'date-fns';
import { InferType, number, object, string } from 'yup';

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

export type StrategySetting = SilverBulletSettingSchemaType;
