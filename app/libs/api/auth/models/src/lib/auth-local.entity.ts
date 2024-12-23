import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

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
}
