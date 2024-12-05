import { DataSource } from 'typeorm';
import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { InjectDataSource, TypeOrmModule } from '@nestjs/typeorm';
import { TypeormConfigModule, TypeormConfigService } from '@app/typeorm-config';

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
export class TypeormFeatureModule implements OnModuleInit {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  logger = new Logger(TypeormFeatureModule.name);

  async onModuleInit() {
    const entities = this.dataSource.options.entities;

    this.logger.debug(`Initialized typeorm with ${entities?.length} entities.`);
  }
}
