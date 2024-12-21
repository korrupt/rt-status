import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@app/user-models';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
})
export class UserFeatureModule {}
