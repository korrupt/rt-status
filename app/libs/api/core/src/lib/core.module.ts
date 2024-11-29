import { Module } from '@nestjs/common';
import { TypeormFeatureModule } from "@app/typeorm-feature";

@Module({
  imports: [TypeormFeatureModule]
})
export class CoreModule {}
