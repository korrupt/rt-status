import type { IQueryInfo } from 'accesscontrol';
import { AclRole } from './acl-role.enum';
import { AclResource } from './acl-resource.enum';

type AccessControlPermission = Required<IQueryInfo> & {
  attributes?: string[];
};

const MANAGE: (
  role: AclRole,
  resource: AclResource,
  attributes: string[],
  possession: 'own' | 'any',
) => AccessControlPermission[] = (role, resource, attributes, possession) => {
  return ['create', 'read', 'update', 'delete'].map((action) => ({
    role,
    action,
    resource,
    possession,
    attributes,
  }));
};

export const permissions: AccessControlPermission[] = [
  {
    role: AclRole.USER,
    action: 'read',
    resource: AclResource.USER,
    possession: 'own',
    attributes: ['*'],
  },
  {
    role: AclRole.USER,
    action: 'update',
    resource: AclResource.USER,
    possession: 'own',
    attributes: ['name'],
  },
  {
    role: AclRole.MANAGER,
    action: 'read',
    resource: AclResource.USER,
    possession: 'any',
    attributes: ['*'],
  },
  {
    role: AclRole.MANAGER,
    action: 'update',
    resource: AclResource.USER,
    possession: 'any',
    attributes: ['name'],
  },
  // ...MANAGE(AclRole.MANAGER, AclResource.USER, ['*', '!roles'], 'any'),
];
