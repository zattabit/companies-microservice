import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ErpConnectionService } from './infrastructure/external-services/erp-connection.service';
import { ErpConnectionBaseService } from './infrastructure/external-services/erp-connection-base.service';
import { ErpController } from './interface/controllers/erp.controller';
import { DatabaseModule } from './database/database.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [DatabaseModule, HttpModule, ScheduleModule.forRoot()],
  controllers: [ErpController],
  providers: [ErpConnectionService, ErpConnectionBaseService],
})
export class AppModule {}
