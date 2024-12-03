import {
  Column,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity('watcher')
@Unique(WatcherEntity.UQ_SLUG, ['slug'])
export class WatcherEntity {
  static UQ_SLUG = 'UQ_WATCHER_SLUG';

  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @PrimaryColumn()
  slug!: string;

  @Column()
  name!: string;

  @Column()
  description!: string;
}
