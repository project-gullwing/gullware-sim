import { Injectable } from '@nestjs/common';
import {Interval} from '@nestjs/schedule';
import {StepperService} from './stepper.service';


@Injectable()
export class GulldroidService {

  constructor(
      private readonly stepper: StepperService
  ) {}

  public setCmd(cmd: string) :void {
    console.log(cmd);
  }

  public getStatus(): string {
    return 'status';
  }

  @Interval(1000)
  public move(): void {
    this.stepper.move();
  }

}
