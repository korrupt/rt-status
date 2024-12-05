import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  Unique,
} from 'typeorm';
import { DomainDeviceEntity } from './domain-device.entity';

@Entity('domain_device_watcher')
@Unique(DomainDeviceWatcherEntity.UQ_DOMAIN_DEVICE_WATCHER_SLUG, [
  'domain_id',
  'device_id',
  'slug',
])
export class DomainDeviceWatcherEntity {
  static UQ_DOMAIN_DEVICE_WATCHER_SLUG = 'UQ_DOMAIN_DEVICE_WATCHER_SLUG';

  @PrimaryColumn()
  domain_id!: string;

  @PrimaryColumn()
  device_id!: string;

  @PrimaryColumn()
  watcher_id!: string;

  @Column()
  slug!: string;

  @ManyToOne(() => DomainDeviceEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'domain_id' })
  @JoinColumn({ name: 'device_id' })
  domain_device!: DomainDeviceEntity;

  @ManyToOne(() => DomainDeviceEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'watcher_id' })
  watcher!: DomainDeviceEntity;
}
