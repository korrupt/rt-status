import { Inject, Injectable, OnModuleInit, Optional } from '@nestjs/common';
import { ACL_PERMISSIONS } from '../tokens';
import { AccessControl } from 'accesscontrol';
import { ACL_ALL_ROLES } from '@app/shared-models';

@Injectable()
export class AclService implements OnModuleInit {
  constructor(@Optional() @Inject(ACL_PERMISSIONS) private permissions: any) {}

  control!: AccessControl;

  async onModuleInit() {
    this.control = new AccessControl(this.permissions || []);
    this.control.grant(ACL_ALL_ROLES);
  }
}
