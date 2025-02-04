import { Permission } from 'accesscontrol';
import { AclResource, AclRole, permissions } from '@app/shared-models';
import { AclService } from '../services';
import {
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';

export type AclResourceInstance = { owner_id: string };
class AclResult<
  T extends object | null = null,
  K extends object | null = null,
> {
  private resultFn?: K extends null ? () => Promise<T> : (dto: K) => Promise<T>;
  private filteredDto: K extends null ? null : K | undefined;

  private permission: Permission;

  constructor(
    readonly action: string,
    readonly resource: string,
    readonly possession: 'own' | 'any',
    readonly auth: AuthUser,
  ) {
    this.permission = this.auth.aclService.control.permission({
      action,
      resource,
      role: auth.roles,
      possession,
    });

    // Initialize filteredDto correctly based on K's type
    this.filteredDto = null as any as K extends null ? null : undefined;
  }

  get granted() {
    return this.permission.granted;
  }

  public withFilteredDto<D extends object>(
    dto: D,
    action = 'read',
  ): AclResult<T, D> {
    const newInstance = new AclResult<T, D>(
      this.action,
      this.resource,
      this.possession,
      this.auth,
    );

    const filteredDto = this.auth.aclService.control
      .permission({
        role: this.auth.roles,
        action,
        possession: this.possession,
        resource: this.resource,
      })
      .filter(dto);

    newInstance.filteredDto = filteredDto as D extends null
      ? null
      : D | undefined;
    newInstance.resultFn = this.resultFn as any; // Preserve function reference safely

    return newInstance;
  }

  public withFunction<R extends object>(
    fn: K extends null ? () => Promise<R> : (dto: K) => Promise<R>,
  ): AclResult<R, K> {
    if (!this.granted) {
      throw new ForbiddenException(AuthUser.INSUFFICIENT_PERMISSIONS_MESSAGE);
    }

    const newInstance = new AclResult<R, K>(
      this.action,
      this.resource,
      this.possession,
      this.auth,
    );

    newInstance.resultFn = fn;
    newInstance.filteredDto = this.filteredDto; // Preserve the previous filtered DTO

    return newInstance;
  }

  private async execute(): Promise<T> {
    if (!this.resultFn) {
      throw new Error('No result available. Call `.and()` first.');
    }

    if (this.filteredDto !== undefined && this.filteredDto !== null) {
      return await (this.resultFn as (dto: K) => Promise<T>)(
        this.filteredDto as K,
      );
    } else {
      return await (this.resultFn as () => Promise<T>)();
    }
  }

  public async filter(): Promise<T> {
    if (!this.resultFn) {
      throw new InternalServerErrorException(`No function set.`);
    }

    const result = await this.execute();

    const readPermission = this.auth.aclService.control.permission({
      action: 'read',
      possession: this.possession,
      resource: this.resource,
      role: this.auth.roles,
    });

    return readPermission.filter(result);
  }

  public async get(): Promise<T> {
    if (!this.resultFn) {
      throw new InternalServerErrorException(`No function set.`);
    }

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
      'delete',
      resource,
      possession || this.getPosession(target),
      this,
    );
  }

  update(
    resource: string,
    target?: AclResourceInstance | undefined | null,
    possession?: 'own' | 'any',
  ): AclResult {
    return new AclResult(
      'update',
      resource,
      possession || this.getPosession(target),
      this,
    );
  }

  create(
    resource: string,
    target?: AclResourceInstance | undefined | null,
    possession?: 'own' | 'any',
  ): AclResult {
    return new AclResult(
      'create',
      resource,
      possession || this.getPosession(target),
      this,
    );
  }

  read(
    resource: AclResource,
    target?: AclResourceInstance | undefined | null,
    possession?: 'own' | 'any',
  ): AclResult {
    return new AclResult(
      'read',
      resource,
      possession || this.getPosession(target),
      this,
    );
  }
}
