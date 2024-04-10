export function getMinDateByTimePeriod(timePeriod: string, endDate: Date) {
  const [, amount, unit] = timePeriod.match(/(\d+)(\w)/) || ['1', 'd'];
  const amountNumber = parseInt(amount, 10);
  const awailableUnitsInThePast = {
    w: 500 * amountNumber * 7,
    d: 500 * amountNumber,
    h: 500 * amountNumber,
    m: 500 * amountNumber,
  };

  const minDate = new Date(endDate);

  switch (unit) {
    case 'w':
      minDate.setDate(endDate.getDate() - awailableUnitsInThePast.w);
      break;
    case 'd':
      minDate.setDate(endDate.getDate() - awailableUnitsInThePast.d);
      break;
    case 'h':
      minDate.setHours(endDate.getHours() - awailableUnitsInThePast.h);
      break;
    case 'm':
      minDate.setMinutes(endDate.getMinutes() - awailableUnitsInThePast.m);
      break;
  }

  return minDate;
}
