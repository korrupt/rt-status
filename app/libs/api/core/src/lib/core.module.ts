import { Module } from '@nestjs/common';
import { TypeormFeatureModule } from "@app/typeorm-feature";
import { DeviceFeatureModule } from "@app/device-feature";

@Module({
  imports: [
    TypeormFeatureModule,
    DeviceFeatureModule
  ]
})
export class CoreModule {}
