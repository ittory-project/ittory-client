const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

export class MillisBuilder {
  private total: number = 0;

  days(value: number): this {
    this.total += value * DAY;
    return this;
  }

  hours(value: number): this {
    this.total += value * HOUR;
    return this;
  }

  minutes(value: number): this {
    this.total += value * MINUTE;
    return this;
  }

  seconds(value: number): this {
    this.total += value * SECOND;
    return this;
  }

  milliseconds(value: number): this {
    this.total += value;
    return this;
  }

  value(): number {
    return this.total;
  }
}

export function inMillis(): MillisBuilder {
  return new MillisBuilder();
}
