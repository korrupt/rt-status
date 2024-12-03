import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";


@Entity('domain')
@Unique(DomainEntity.UQ_SLUG, ['slug'])
export class DomainEntity {

  static UQ_SLUG = "UQ_DOMAIN_SLUG";

  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  slug!: string;

  @Column({ nullable: true })
  description!: string;
}
