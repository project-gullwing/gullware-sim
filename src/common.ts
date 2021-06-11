export const SEC_TO_MICROS = 1000000.0;
export const TRANSMISSION_RATIO: number = 1.0 / 2400.0;
export const STEP_SIZE_DEG = 1.8;
export const GEARED_STEP_SIZE_DEG: number = STEP_SIZE_DEG * TRANSMISSION_RATIO;
export const MS_STEP_SIZE_DEG: number[] = [
  GEARED_STEP_SIZE_DEG,
  GEARED_STEP_SIZE_DEG / 2.0,
  GEARED_STEP_SIZE_DEG / 4.0,
  GEARED_STEP_SIZE_DEG / 8.0,
  GEARED_STEP_SIZE_DEG / 16.0,
  GEARED_STEP_SIZE_DEG / 32.0,
  GEARED_STEP_SIZE_DEG / 64.0,
  GEARED_STEP_SIZE_DEG / 128.0,
  GEARED_STEP_SIZE_DEG / 256.0,
];


function diff(a: number, b: number, epsilon: number): number {
  return (Math.abs(a) < Math.abs(b) ? Math.abs(b) : Math.abs(a)) * epsilon;
}


export function gt(a: number, b: number, epsilon: number): boolean {
  const inf = (a === Number.POSITIVE_INFINITY) ? 1 : (b === Number.POSITIVE_INFINITY) ? -1 : 0;
  if (inf === 0) {
    return (a - b) > diff(a, b, epsilon);
  }
  return (inf > 0);
}


export function lt(a: number, b: number, epsilon: number): boolean {
  const inf = (b === Number.POSITIVE_INFINITY) ? 1 : (a === Number.POSITIVE_INFINITY) ? -1 : 0;
  if (inf === 0) {
    return (b - a) > diff(a, b, epsilon);
  }
  return (inf > 0);
}


export function angularSpeedToDelay(speed_degSec: number, ms: number): number {
  return (speed_degSec > 0)
      ? Math.abs(SEC_TO_MICROS / (speed_degSec / MS_STEP_SIZE_DEG[ms]))
      : Number.POSITIVE_INFINITY;
}


export function delayToAngularSpeed(delay_us: number, ms: number): number {
  return (delay_us != Number.POSITIVE_INFINITY)
      ? MS_STEP_SIZE_DEG[ms] * (SEC_TO_MICROS / delay_us)
      : 0.0;
}
