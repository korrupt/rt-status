import { UpdateUserModel } from '@app/shared-models';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto implements UpdateUserModel {
  @IsOptional()
  @IsString()
  name?: string | undefined;
}
