import { object, number, string, mixed } from 'yup';

export const schemaOHLC = object().shape({
  startTime: number().required(),
  endTime: number()
    // endTime cant be less than startTime
    .test(
      'is-greater',
      'End time must be greater than start time',
      function (value) {
        return !!value && value > this.parent.startTime;
      }
    )
    // endTime cant be 10 years from now
    .test(
      'is-less',
      'End time must be less than 10 years from now',
      function (value) {
        return !!value && value < Date.now() + 315569520000;
      }
    )
    // endTime cant be more than 2 years from now if this.parent.interval contains m or h
    .test(
      'is-correct-with-interval',
      'End time must be less than 2 years from now with this interval',
      function (value) {
        return (
          !!value &&
          ['m', 'h'].some((i) => this.parent.interval.includes(i)) &&
          value < Date.now() + 63072000000
        );
      }
    )

    .required(),
  slug: string().required(),
  interval: mixed((input): input is IntervalKeys => input)
    .test('is-interval', 'Invalid interval', (input) =>
      ['1m', '5m', '15m', '30m', '1h', '4h', '1d', '1w'].includes(
        input as string
      )
    )
    .required(),
});
