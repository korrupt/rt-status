import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CreateDeviceModel } from '@app/shared-models';

export class CreateDeviceDto implements CreateDeviceModel {
  @IsNotEmpty()
  @IsString() // TODO: enforce slug format
  slug!: string;

  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string | undefined;

  @IsOptional()
  location?: unknown;
}
