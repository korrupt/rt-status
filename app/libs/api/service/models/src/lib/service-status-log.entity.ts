import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity('status-log', { synchronize: false })
export class ServiceStatusLogEntity {
  @PrimaryColumn({ name: 'time' })
  time!: Date;

  @Column({ name: 'service' })
  service!: string;

  @Column({ type: 'jsonb', name: 'data' })
  data!: JSON
}
