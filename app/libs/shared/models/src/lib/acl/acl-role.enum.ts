export enum AclRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  USER = 'USER',
  GUEST = 'GUEST',
}

export const ACL_DEFAULT_ROLE: AclRole = AclRole.GUEST;
export const ACL_ALL_ROLES = Object.values(AclRole);
