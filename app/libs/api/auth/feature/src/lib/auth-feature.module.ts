import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuthkeyEntity, AuthLocalEntity } from '@app/auth-models';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  AuthLocalService,
  AuthLocalController,
  EmailAlreadyUsedInterceptor,
} from '@app/auth-data-access';
import { AuthConfigModule } from '@app/auth-config';

@Module({
  controllers: [AuthLocalController],
  imports: [
    TypeOrmModule.forFeature([AuthLocalEntity, AuthkeyEntity]),
    AuthConfigModule,
  ],
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
