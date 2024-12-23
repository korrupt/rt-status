import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuthkeyEntity, AuthLocalEntity } from '@app/auth-models';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  AuthLocalService,
  AuthLocalController,
  EmailAlreadyUsedInterceptor,
} from '@app/auth-data-access';

@Module({
  controllers: [AuthLocalController],
  imports: [TypeOrmModule.forFeature([AuthLocalEntity, AuthkeyEntity])],
  providers: [
    AuthLocalService,
    EmailAlreadyUsedInterceptor,
    {
      provide: APP_INTERCEPTOR,
      useClass: EmailAlreadyUsedInterceptor,
    },
  ],
})
export class AuthFeatureModule {}
