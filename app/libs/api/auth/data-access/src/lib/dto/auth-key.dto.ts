import { CreateAuthKeyModel } from '@app/shared-models';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateAuthkeyDto implements CreateAuthKeyModel {
  @IsOptional()
  @IsDateString()
  expires_at?: Date;

  @IsNotEmpty()
  @IsString()
  @IsUUID()
  watcher_id!: string;
}
