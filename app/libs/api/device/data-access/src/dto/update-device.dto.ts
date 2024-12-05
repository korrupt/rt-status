import { IsOptional, IsString } from 'class-validator';
import { UpdateDeviceModel } from '@app/shared-models';

export class UpdateDeviceDto implements UpdateDeviceModel {
  @IsOptional()
  @IsString() // TODO: enforce slug format
  slug!: string;

  @IsOptional()
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string | undefined;

  @IsOptional()
  location?: unknown;
}
