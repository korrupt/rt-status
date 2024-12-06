import { UpdateWatcherModel } from '@app/shared-models';
import { IsOptional, IsString } from 'class-validator';

export class UpdateWatcherDto implements UpdateWatcherModel {
  @IsOptional()
  @IsString() // TODO: enforce slug
  slug?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  device_id?: string;
}
