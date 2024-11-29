import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity('service')
@Unique(ServiceEntity.UQ_SLUG, ['slug'])
export class ServiceEntity {

  static UQ_SLUG = 'UQ_SLUG';

  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @PrimaryColumn()
  slug!: string;

  @Column()
  name!: string;

  @Column()
  description!: string;
}
