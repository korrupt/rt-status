import { Module } from '@nestjs/common';
import { ServiceEntity } from "@app/service-models";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [
    TypeOrmModule.forFeature([ServiceEntity])
  ]
})
export class ServiceFeatureModule {}
