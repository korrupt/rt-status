import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity('device', { synchronize: false })
@Unique(DeviceEntity.UQ_DEVICE_SLUG, ['slug'])
export class DeviceEntity {

  static UQ_DEVICE_SLUG = "UQ_DEVICE_SLUG";

  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  slug!: string;

  @Column({})
  name!: string;

  @Column({ nullable: true })
  description!: string;

  @Column({ nullable: true, type: 'geography' })
  location: unknown;
}
