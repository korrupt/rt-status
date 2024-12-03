import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, Unique } from "typeorm";
import { DomainEntity } from "./domain.entity";
import { DeviceEntity } from "./device.entity";


@Entity('domain_device')
@Unique(DomainDeviceEntity.UQ_DOMAIN_DEVICE_SLUG, ['domain_id', 'slug'])
export class DomainDeviceEntity {

  static UQ_DOMAIN_DEVICE_SLUG = "UQ_DOMAIN_DEVICE_SLUG"

  @PrimaryColumn()
  domain_id!: string;

  @PrimaryColumn()
  device_id!: string;

  @Column({})
  slug!: string;

  @ManyToOne(() => DomainEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'domain_id' })
  domain!: DomainEntity;

  @ManyToOne(() => DeviceEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'device_id' })
  device!: DeviceEntity;

}
