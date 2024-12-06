import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { WatcherService } from '../services/watcher.service';
import { DeviceService } from '../services';
import { CreateWatcherDto, UpdateWatcherDto } from '../dto';
import {
  CreateWatcherResultModel,
  DeleteWatcherResultModel,
  FindWatcherByIdResultModel,
  FindWatcherResultModel,
  UpdateWatcherResultModel,
} from '@app/shared-models';

@Controller('watcher')
export class WatcherController {
  constructor(
    private watcher: WatcherService,
    private device: DeviceService,
  ) {}

  @Post()
  public async create(
    @Body() dto: CreateWatcherDto,
  ): Promise<CreateWatcherResultModel> {
    return this.watcher.create(dto);
  }

  @Get()
  public async find(): Promise<FindWatcherResultModel> {
    return this.watcher.find();
  }

  @Get(':id')
  public async findById(
    @Param('id') id: string,
  ): Promise<FindWatcherByIdResultModel> {
    return this.watcher.findById(id);
  }

  @Patch(':id')
  public async update(
    @Param('id') id: string,
    @Query() dto: UpdateWatcherDto,
  ): Promise<UpdateWatcherResultModel> {
    return this.watcher.update(id, dto);
  }

  @Delete('id')
  public async delete(
    @Param('id') id: string,
  ): Promise<DeleteWatcherResultModel> {
    return this.watcher.delete(id);
  }
}
