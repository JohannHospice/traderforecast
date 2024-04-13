export class Realtime {
  intervals: Timer[] = [];
  time: number;

  constructor(time: number) {
    this.time = time;
  }

  // one at a time
  watch(onUpdate: () => Promise<void>) {
    if (this.intervals.length > 0) {
      this.clear();
    }
    const interval = setInterval(onUpdate, this.time);
    this.intervals.push(interval);
  }

  clear() {
    this.intervals.forEach((interval) => clearInterval(interval));
  }
}
