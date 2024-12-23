import { Module } from '@nestjs/common';
import { AuthkeyEntity, AuthLocalEntity } from '@app/auth-models';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([AuthLocalEntity, AuthkeyEntity])],
})
export class AuthFeatureModule {}
