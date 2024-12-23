import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { DeviceEntity } from '@app/device-models';

@Entity('auth_key')
@Unique(AuthkeyEntity.UQ_AUTH_KEY_KEY, ['key'])
export class AuthkeyEntity {
  static UQ_AUTH_KEY_KEY = 'UQ_AUTH_KEY_KEY';

  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  key!: string;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updated_at!: Date;

  @Column({ type: 'timestamptz', name: 'expires_at', nullable: true })
  expires_at?: Date;

  @Column({ type: 'timestamptz', name: 'last_used_at' })
  last_used_at!: Date;

  @Column({ type: 'timestamptz', name: 'revoked_at', nullable: true })
  revoked_at?: Date;

  @ManyToOne(() => DeviceEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'device_id' })
  device_id!: string;
}
