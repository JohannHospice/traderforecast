export class Realtime {
  intervals: NodeJS.Timeout[] = [];
  time: number;

  constructor(time: number) {
    this.time = time;
  }

  // one at a time
  watch(onUpdate: () => Promise<void>) {
    if (this.intervals.length > 0) {
      this.clear();
    }

    this.intervals.push(setInterval(onUpdate, this.time));
  }

  clear() {
    this.intervals.forEach((interval) => clearInterval(interval));
  }
}
