import { Time } from 'lightweight-charts';

export function millisecondsToTime(milliseconds: number): Time {
  return (milliseconds / 1000) as Time;
}
