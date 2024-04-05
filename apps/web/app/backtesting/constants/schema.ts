import { format } from 'date-fns';
import { InferType, date, number, object, string } from 'yup';
import { optionTimePeriod } from '.';
import { getMinDateByTimePeriod } from '../helper/date';

export const backtestingSettingsSchema = object()
  .shape({
    strategy: string().required(),
    walletAmount: number()
      .typeError('Amount must be a number')
      .positive()
      .min(0)
      .nonNullable()
      .required(),
    pair: string().required(),
    timePeriod: string().oneOf(optionTimePeriod).required(),
    endDate: date()
      .max(new Date(Date.now() + 1000), 'End date must be before now.')
      .required(),
    startDate: date()
      .when(['timePeriod', 'endDate'], ([timePeriod, endDate], schema) => {
        const minDate = getMinDateByTimePeriod(timePeriod, endDate);
        return schema
          .min(
            minDate,
            `Start date can't exceed ${format(minDate, `yyyy-MM-dd\'T\'HH:mm`)} with the selected time period.`
          )
          .max(endDate, 'Start date must be before end date.');
      })
      .required(),
  })
  .required();

export type BacktestingSettingsSchemaType = InferType<
  typeof backtestingSettingsSchema
>;
