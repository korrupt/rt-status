import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuthkeyEntity, AuthLocalEntity } from '@app/auth-models';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  AuthLocalService,
  AuthLocalController,
  EmailAlreadyUsedInterceptor,
  JwtGuard,
  JwtStrategy,
} from '@app/auth-data-access';
import { AuthConfigModule, AuthConfigService } from '@app/auth-config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [AuthLocalController],
  imports: [
    TypeOrmModule.forFeature([AuthLocalEntity, AuthkeyEntity]),
    AuthConfigModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [AuthConfigModule],
      inject: [AuthConfigService],
      useFactory: (config: AuthConfigService) => ({
        secret: config.JWT_SECRET,
        signOptions: {
          expiresIn: config.JWT_EXPIRES_IN,
        },
      }),
    }),
  ],
  providers: [
    AuthLocalService,
    EmailAlreadyUsedInterceptor,
    JwtGuard,
    JwtStrategy,
    {
      provide: APP_INTERCEPTOR,
      useClass: EmailAlreadyUsedInterceptor,
    },
  ],
  exports: [JwtGuard],
})
export class AuthFeatureModule {}
