export function getMinDateByTimePeriod(timePeriod: string, endDate: Date) {
  const awailableUnitsInThePast = {
    w: 100,
    d: 100,
    h: 100,
    m: 100,
  };

  const [, , unit] = timePeriod.match(/(\d+)(\w)/) || ['1', 'd'];
  const minDate = new Date(endDate);

  switch (unit) {
    case 'w':
      minDate.setDate(endDate.getDate() - awailableUnitsInThePast.w * 7);
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
