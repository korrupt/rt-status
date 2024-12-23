import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '@app/user-models';

@Entity('auth_local')
@Unique(AuthLocalEntity.UQ_AUTH_LOCAL_EMAIL, ['email'])
export class AuthLocalEntity {
  static UQ_AUTH_LOCAL_EMAIL = 'UQ_AUTH_LOCAL_EMAIL';

  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  email!: string;

  @Column()
  hash!: string;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updated_at!: Date;

  @OneToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user_id!: string;
}
