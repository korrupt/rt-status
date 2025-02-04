import { Permission } from 'accesscontrol';
import { AclResource, AclRole, permissions } from '@app/shared-models';
import { AclService } from '../services';
import { ForbiddenException } from '@nestjs/common';

export type AclResourceInstance = { owner_id: string };

class AclResult<
  T extends object | null = null,
  K extends object | null = null,
> {
  private resultFn?: (filteredDto?: any) => Promise<any>; // Store function reference
  private filteredDto?: any;

  constructor(
    readonly permission: Permission,
    readonly auth: AuthUser,
  ) {}

  get granted() {
    return this.permission.granted;
  }

  public and<R extends object, U extends object | undefined = undefined>(
    fn: (dto: U) => Promise<R>,
    dto?: U,
    action?: 'read' | 'update',
  ): AclResult<T extends object ? T & R : R> {
    if (!this.granted) {
      throw new ForbiddenException(AuthUser.INSUFFICIENT_PERMISSIONS_MESSAGE);
    }

    if (dto) {
      this.filteredDto = this.permission.filter(dto); // todo: should be read
    }

    // Store function reference without executing it
    const newInstance = new AclResult<T extends object ? T & R : R>(
      this.permission,
      this.auth,
    );
    newInstance.resultFn = fn;
    return newInstance;
  }

  private async execute() {
    if (!this.resultFn) {
      throw new Error('No result available. Call `.and()` first.');
    }

    if (this.filteredDto) {
      return await this.resultFn(this.filteredDto);
    } else {
      return await this.resultFn(); // Execute stored function dynamically
    }
  }

  public async filter(): Promise<T> {
    const result = await this.execute();
    return this.permission.filter(result);
  }

  public async get(): Promise<T> {
    return this.execute();
  }
}

export class AuthUser {
  constructor(
    readonly aclService: AclService,
    private payload?: { sub: string; roles: string[] },
  ) {}

  static INSUFFICIENT_PERMISSIONS_MESSAGE = 'Insufficient permissions.';

  get roles(): string[] {
    return this.payload ? this.payload.roles.concat(AclRole.MANAGER) : [];
  }

  get id(): string | null {
    return this.payload ? this.payload.sub : null;
  }

  public getPosession(target: AclResourceInstance | undefined | null) {
    if (this.payload && target && target.owner_id) {
      return target.owner_id === this.payload.sub ? 'own' : 'any';
    }
    return 'any';
  }

  delete(
    resource: string,
    target?: AclResourceInstance | undefined | null,
    possession?: 'own' | 'any',
  ): AclResult {
    return new AclResult(
      this.aclService.control.permission({
        action: 'delete',
        possession: possession || this.getPosession(target),
        resource,
        role: this.roles,
      }),
      this,
    );
  }

  update(
    resource: string,
    target?: AclResourceInstance | undefined | null,
    possession?: 'own' | 'any',
  ): AclResult {
    return new AclResult(
      this.aclService.control.permission({
        action: 'update',
        possession: possession || this.getPosession(target),
        resource,
        role: this.roles,
      }),
      this,
    );
  }

  create(
    resource: string,
    target?: AclResourceInstance | undefined | null,
    possession?: 'own' | 'any',
  ): AclResult {
    return new AclResult(
      this.aclService.control.permission({
        action: 'create',
        possession: possession || this.getPosession(target),
        resource,
        role: this.roles,
      }),
      this,
    );
  }

  read(
    resource: AclResource,
    target?: AclResourceInstance | undefined | null,
    possession?: 'own' | 'any',
  ): AclResult {
    return new AclResult(
      this.aclService.control.permission({
        action: 'read',
        possession: possession || this.getPosession(target),
        resource,
        role: this.roles,
      }),
      this,
    );
    // const action = 'read';
    // const role = this.roles;

    // return this.aclService.control.permission({
    //   action,
    //   possession: possession || this.getPosession(target),
    //   resource,
    //   role,
    // });
  }
}
