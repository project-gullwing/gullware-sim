import { Injectable } from '@nestjs/common';
import {angularSpeedToDelay, delayToAngularSpeed, gt, lt} from './common';
import {DELAYS_MICROS, MAX_RAMP_IDX} from './ramp';
import {RunParams} from './model/model';

enum Dir {
  CCW = -1,
  CW = 1,
}

@Injectable()
export class StepperService {

  private _n = -1;
  private _dir = Dir.CW;
  private _currentDelay_us = Number.POSITIVE_INFINITY;
  private _targetDelay_us = 0;
  private _ms = 0;
  private _acc = false;
  private _lastStep = 0;
  private _flip = false;

  public getRunParams(): RunParams {
    return {
      maxSpeed_degSec: delayToAngularSpeed(DELAYS_MICROS[MAX_RAMP_IDX], 0),
      minDelay_us: DELAYS_MICROS[MAX_RAMP_IDX]
    };
  }


  public setAngularSpeedDegSec(speed_degSec: number): void {
    if ((speed_degSec * this._dir) < 0) {
      this._flip = true;
    }
    this._targetDelay_us = angularSpeedToDelay(Math.abs(speed_degSec), this._ms);
    this._acc = true;
    console.log(`==== SET TGT ${this._targetDelay_us} (${speed_degSec}) ==== FLIP: ${((speed_degSec * this._dir) < 0)}`);
  }


  public stop(): void {
    this._targetDelay_us = Number.POSITIVE_INFINITY;
    this._acc = true;
    console.log(`==== STOP ====`);
  }


  public move(): void {
    let tgt = this._targetDelay_us;
    if (this._acc) {
      if (this._flip) {
        if (this._currentDelay_us !== Number.POSITIVE_INFINITY) {
          tgt = Number.POSITIVE_INFINITY;
        } else {
          console.log('FLIP DIR');
          this._flip = false;
          this._dir *= -1;
        }
      }
      const delta = lt(tgt, this._currentDelay_us, 0.0001)
          ? 1
          : gt(tgt, this._currentDelay_us, 0.0001)
              ? -1
              : 0;

      this._n += delta;
      this._currentDelay_us = (this._n < 0)
          ? Number.POSITIVE_INFINITY
          : DELAYS_MICROS[this._n];

      this._acc = ((delta > 0) && (this._n < MAX_RAMP_IDX) && (DELAYS_MICROS[this._n+1] > tgt)) || ((delta < 0) && (this._n >= 0)) || this._flip;

      console.log(`N ${this._n} TGT ${tgt} (${delayToAngularSpeed(tgt, 0)} °/s) CURR ${this._currentDelay_us} (${delayToAngularSpeed(this._currentDelay_us, 0).toLocaleString(undefined, {maximumFractionDigits: 3})} °/s) ... ${(this._dir > 0) ? '>' : '<'} ... ${(delta > 0) ? '+' : (delta < 0) ? '-' : '='}`);
    }
    if (this._n >= 0) {
      if ((Date.now() - this._lastStep) > (DELAYS_MICROS[this._n] * 100)) {
        //console.log('X');
      }
    }
  }


}
