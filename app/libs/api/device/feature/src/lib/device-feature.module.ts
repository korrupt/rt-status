import { Module } from '@nestjs/common';
import {
  DeviceEntity,
  WatcherEntity,
  WatcherHeartbeatEntity,
  DomainEntity,
  DomainDeviceEntity,
  DomainDeviceWatcherEntity,
} from '@app/device-models';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  DeviceController,
  DeviceService,
  WatcherController,
  WatcherService,
} from '@app/device-data-access';

@Module({
  controllers: [DeviceController, WatcherController],
  imports: [
    TypeOrmModule.forFeature([
      DeviceEntity,
      WatcherEntity,
      WatcherHeartbeatEntity,
      DomainEntity,
      DomainDeviceEntity,
      DomainDeviceWatcherEntity,
    ]),
  ],
  providers: [DeviceService, WatcherService],
})
export class DeviceFeatureModule {}
