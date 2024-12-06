import { CreateWatcherModel } from '@app/shared-models';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateWatcherDto implements CreateWatcherModel {
  @IsNotEmpty()
  @IsString() // TODO: enforce slug
  slug!: string;

  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsString()
  device_id!: string;
}
