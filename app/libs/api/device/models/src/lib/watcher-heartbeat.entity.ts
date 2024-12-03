import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { WatcherEntity } from './watcher.entity';

@Entity('watcher_heartbeat', { synchronize: false })
export class WatcherHeartbeatEntity {
  @PrimaryColumn({ name: 'time' })
  time!: Date;

  @Column({ name: 'watcher_id' })
  watcher_id!: string;

  @Column({ type: 'jsonb', name: 'data' })
  data!: JSON;

  @ManyToOne(() => WatcherEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'watcher_id' })
  watcher!: WatcherEntity;
}
