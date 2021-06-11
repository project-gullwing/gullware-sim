import {Controller, Get, Post, Req} from '@nestjs/common';
import * as getRawBody from 'raw-body';
import {RunParams} from './model/model';
import {GulldroidService} from './gulldroid.service';

@Controller()
export class BtController {
  constructor(private readonly gulldroid: GulldroidService) {}

  // @Get()
  // public getRunParams(): RunParams {
  //   return this.stepper.getRunParams();
  // }


  // @Post('go')
  // public async setSpeed(@Req() req): Promise<void> {
  //   if (req.readable) {
  //     const raw = await getRawBody(req);
  //     const speedDegSec = +raw.toString().trim();
  //     return this.stepper.setAngularSpeedDegSec(speedDegSec);
  //   }
  // }
  //
  //
  // @Post('stop')
  // public stop(): void {
  //   return this.stepper.stop();
  // }



  @Post('cmd')
  public async cmd(@Req() req): Promise<void> {
    if (req.readable) {
      const raw = await getRawBody(req);
      const cmd = raw.toString().trim();
      return this.gulldroid.setCmd(cmd);
    }
  }


  @Get('status')
  public status(): string {
     return this.gulldroid.getStatus();
  }


}
