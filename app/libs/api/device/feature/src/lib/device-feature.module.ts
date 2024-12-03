import { Module } from '@nestjs/common';
import { DeviceEntity, WatcherEntity, WatcherHeartbeatEntity } from '@app/device-models';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([DeviceEntity, WatcherEntity, WatcherHeartbeatEntity])],
})
export class DeviceFeatureModule  {}
