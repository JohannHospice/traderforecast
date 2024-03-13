export class Realtime {
  intervals: NodeJS.Timeout[] = [];
  time: number;

  constructor(time: number) {
    this.time = time;
  }

  watch(onUpdate: () => Promise<void>) {
    this.intervals.push(setInterval(onUpdate, this.time));
  }

  clear() {
    this.intervals.forEach((interval) => clearInterval(interval));
  }
}
