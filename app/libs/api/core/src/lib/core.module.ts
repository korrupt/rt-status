import { Module } from '@nestjs/common';
import { TypeormFeatureModule } from "@app/typeorm-feature";
import { ServiceFeatureModule } from "@app/service-feature";

@Module({
  imports: [
    TypeormFeatureModule,
    ServiceFeatureModule
  ]
})
export class CoreModule {}
