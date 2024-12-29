import { CreateWatcherModel } from '@app/shared-models';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateDeviceWatcherDto
  implements Omit<CreateWatcherModel, 'device_id'>
{
  @IsNotEmpty()
  @IsString() // TODO: enforce slug
  slug!: string;

  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;
}
