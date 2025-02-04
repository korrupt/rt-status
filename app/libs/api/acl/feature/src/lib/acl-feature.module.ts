import { DynamicModule, Global, Module } from '@nestjs/common';
import { AclService, ACL_PERMISSIONS } from '@app/acl-data-access';

@Global()
@Module({})
export class AclFeatureModule {
  static register(permissions: any): DynamicModule {
    return {
      module: AclFeatureModule,
      providers: [
        AclService,
        // AclInterceptor,
        {
          provide: ACL_PERMISSIONS,
          useValue: permissions,
        },
      ],
      exports: [AclService /* AclInterceptor*/],
    };
  }
}
