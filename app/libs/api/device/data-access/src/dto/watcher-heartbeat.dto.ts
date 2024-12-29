import { CreateWatcherHeartbeatModel } from '@app/shared-models';
import { IsNotEmpty, IsObject, IsString } from 'class-validator';

export class CreateWatcherHeartbeatDto
  implements Omit<CreateWatcherHeartbeatModel, 'watcher_id'>
{
  @IsNotEmpty()
  @IsObject()
  metadata!: object;

  @IsNotEmpty()
  @IsString()
  status!: string;

  @IsNotEmpty()
  @IsString()
  type!: string;
}
