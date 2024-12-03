import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { DeviceEntity } from './device.entity';

@Entity('watcher', { synchronize: false })
@Unique(WatcherEntity.UQ_SLUG, ['device_id', 'slug'])
export class WatcherEntity {
  static UQ_SLUG = 'UQ_WATCHER_SLUG';

  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  slug!: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
  description!: string;

  @Column({ name: 'device_id' })
  device_id!: string;

  @ManyToOne(() => DeviceEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'device_id' })
  device!: DeviceEntity;

}
