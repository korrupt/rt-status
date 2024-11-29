
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeormConfigModule, TypeormConfigService } from "@app/typeorm-config";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [TypeormConfigModule],
      inject: [TypeormConfigService],
      useFactory: (conf: TypeormConfigService) => ({
        type: 'postgres',
        host: conf.HOST,
        port: conf.PORT,
        username: conf.USER,
        password: conf.PASSWORD,
        database: conf.DATABASE,
        synchronize: conf.SYNC,
        autoLoadEntities: true,
        // logging: true,
        useUTC: true,
      }),
    }),
  ],
  exports: [TypeOrmModule],
})
export class TypeormFeatureModule {}
