import { Module } from '@nestjs/common';
import { BtController } from './bt.controller';
import { StepperService } from './stepper.service';
import {ScheduleModule} from '@nestjs/schedule';
import {GulldroidService} from './gulldroid.service';
import {WsGateway} from './ws.gateway';

@Module({
  imports: [
      ScheduleModule.forRoot()
  ],
  controllers: [
      BtController
  ],
  providers: [
      StepperService,
      GulldroidService,
      WsGateway,
  ],
})
export class AppModule {}
