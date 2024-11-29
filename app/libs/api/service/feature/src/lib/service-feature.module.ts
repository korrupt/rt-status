import { Module } from '@nestjs/common';
import { ServiceEntity, ServiceStatusLogEntity } from "@app/service-models";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [
    TypeOrmModule.forFeature([ServiceEntity, ServiceStatusLogEntity])
  ]
})
export class ServiceFeatureModule {}
