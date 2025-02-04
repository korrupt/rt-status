export enum AclResource {
  USER = 'USER',
  DEVICE = 'DEVICE',
  WATCHER = 'WATCHER',
  HEARTBEAT = 'HEARTBEAT',
  DOMAIN = 'DOMAIN',
  DOMAIN_DEVICE = 'DOMAIN_DEVICE',
  DOMAIN_DEVICE_WATCHER = 'DOMAIN_DEVICE_WATCHER',
}

export const ACL_ALL_RESOURCES: AclResource[] = Object.values(AclResource);
