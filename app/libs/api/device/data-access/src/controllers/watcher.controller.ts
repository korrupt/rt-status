import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { WatcherService } from '../services/watcher.service';
import { DeviceService } from '../services';
// import { CreateWatcherDto, UpdateWatcherDto } from '../dto';
// import {
//   CreateWatcherResultModel,
//   DeleteWatcherResultModel,
//   FindWatcherByIdResultModel,
//   FindWatcherResultModel,
//   UpdateWatcherResultModel,
// } from '@app/shared-models';
import { AuthKeyGuard } from '@app/auth-data-access';
import { CreateWatcherHeartbeatDto } from '../dto';

@Controller('watcher')
@UseGuards(AuthKeyGuard)
export class WatcherController {
  constructor(
    private watcher: WatcherService,
    private device: DeviceService,
  ) {}

  @Post('heartbeat')
  public async publishHeartbeat(
    @Req() req: Request & { user: { watcher_id: string } },
    @Body() dto: CreateWatcherHeartbeatDto,
  ) {
    return this.watcher.createWatcherHeartbeat({ ...dto, ...req.user });
  }

  //   @Post()
  //   public async create(
  //     @Body() dto: CreateWatcherDto,
  //   ): Promise<CreateWatcherResultModel> {
  //     return this.watcher.create(dto);
  //   }

  //   @Get()
  //   public async find(): Promise<FindWatcherResultModel> {
  //     return this.watcher.find();
  //   }

  //   @Get(':id')
  //   public async findById(
  //     @Param('id') id: string,
  //   ): Promise<FindWatcherByIdResultModel> {
  //     return this.watcher.findById(id);
  //   }

  //   @Patch(':id')
  //   public async update(
  //     @Param('id') id: string,
  //     @Query() dto: UpdateWatcherDto,
  //   ): Promise<UpdateWatcherResultModel> {
  //     return this.watcher.update(id, dto);
  //   }

  //   @Delete('id')
  //   public async delete(
  //     @Param('id') id: string,
  //   ): Promise<DeleteWatcherResultModel> {
  //     return this.watcher.delete(id);
  //   }
}
