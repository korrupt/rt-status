import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('watcher_heartbeat', { synchronize: false })
export class WatcherHeartbeatEntity {
  @PrimaryColumn({ name: 'time' })
  time!: Date;

  @Column({ name: 'service' })
  service!: string;

  @Column({ type: 'jsonb', name: 'data' })
  data!: JSON;
}
