import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import * as Joi from 'joi';
import configuration from './configuration';
import { TypeormConfigService } from './typeorm-config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      ...(process.env['ENV_FILE_PATH']
        ? { envFilePath: process.env['ENV_FILE_PATH'] }
        : {}),
      load: [configuration],
      validationSchema: Joi.object({
        POSTGRES_HOST: Joi.string().default('postgres'),
        POSTGRES_PORT: Joi.number().default(5432),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DATABASE: Joi.string().required(),
        TYPEORM_SYNC: Joi.boolean().default(false),
      }),
    }),
  ],
  providers: [ConfigService, TypeormConfigService],
  exports: [ConfigService, TypeormConfigService],
})
export class TypeormConfigModule {}
