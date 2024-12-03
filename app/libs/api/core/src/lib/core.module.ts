import { Module, ValidationPipe } from '@nestjs/common';
import { TypeormFeatureModule } from "@app/typeorm-feature";
import { DeviceFeatureModule } from "@app/device-feature";
import { APP_PIPE } from "@nestjs/core";

@Module({
  imports: [
    TypeormFeatureModule,
    DeviceFeatureModule
  ],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({ whitelist: true, transform: true })
    }
  ]
})
export class CoreModule {}
