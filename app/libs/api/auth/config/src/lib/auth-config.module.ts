import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './configuration';
import * as Joi from 'joi';
import { AuthConfigService } from './auth-config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      ...(process.env['ENV_FILE_PATH']
        ? { envFilePath: process.env['ENV_FILE_PATH'] }
        : {}),
      load: [configuration],
      validationSchema: Joi.object({
        AUTH_JWT_EXPIRES_IN: Joi.string().required(),
        AUTH_JWT_SECRET: Joi.string().required(),
      }),
    }),
  ],
  providers: [ConfigService, AuthConfigService],
  exports: [ConfigService, AuthConfigService],
})
export class AuthConfigModule {}
