import { Module } from '@nestjs/common';
import { DeviceEntity, WatcherEntity, WatcherHeartbeatEntity, DomainEntity, DomainDeviceEntity, DomainDeviceWatcherEntity } from '@app/device-models';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([DeviceEntity, WatcherEntity, WatcherHeartbeatEntity, DomainEntity, DomainDeviceEntity, DomainDeviceWatcherEntity])],
})
export class DeviceFeatureModule  {}
