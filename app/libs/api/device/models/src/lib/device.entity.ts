import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('device', { synchronize: false })
export class DeviceEntity {
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
