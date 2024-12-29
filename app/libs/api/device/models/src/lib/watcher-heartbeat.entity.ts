import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { WatcherEntity } from './watcher.entity';

@Entity('watcher_heartbeat', { synchronize: false })
export class WatcherHeartbeatEntity {
  @PrimaryColumn({ name: 'time' })
  time!: Date;

  @PrimaryColumn({ name: 'watcher_id' })
  watcher_id!: string;

  @Column()
  status!: string;

  @Column()
  type!: string;

  @Column({ type: 'jsonb', name: 'metadata' })
  metadata!: JSON;

  @ManyToOne(() => WatcherEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'watcher_id' })
  watcher!: WatcherEntity;
}
