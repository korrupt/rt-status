import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { DeviceService } from '../services/device.service';
import {
  CreateDeviceDto,
  CreateDeviceWatcherDto,
  UpdateDeviceDto,
} from '../dto';
import {
  DeleteDeviceResultModel,
  FindDeviceByIdResultModel,
  FindDeviceResultModel,
  FindWatcherByIdResultModel,
  FindWatcherResultModel,
} from '@app/shared-models';
import { WatcherService } from '../services';
import { JwtGuard } from '@app/auth-data-access';

@Controller('device')
@UseGuards(JwtGuard)
export class DeviceController {
  constructor(
    private device: DeviceService,
    private watcher: WatcherService,
  ) {}

  @Post()
  public async create(@Body() dto: CreateDeviceDto) {
    return this.device.create(dto);
  }

  @Get()
  public async find(@Query() params: unknown): Promise<FindDeviceResultModel> {
    return this.device.find(params);
  }

  @Get(':id')
  public async findById(
    @Param('id') id: string,
  ): Promise<FindDeviceByIdResultModel> {
    return this.device.findById(id);
  }

  @Patch(':id')
  public async update(
    @Param('id') id: string,
    @Body() dto: UpdateDeviceDto,
  ): Promise<FindDeviceByIdResultModel> {
    return this.device.update(id, dto);
  }

  @Delete(':id')
  public async delete(
    @Param('id') id: string,
  ): Promise<DeleteDeviceResultModel> {
    return this.device.delete(id);
  }

  @Post(':id/watcher')
  public async createDeviceWatcher(
    @Param('id') device_id: string,
    @Body() dto: CreateDeviceWatcherDto,
  ) {
    return this.watcher.create({ ...dto, device_id });
  }

  @Get(':id/watcher')
  public async findDeviceWatchers(
    @Param('id') id: string,
  ): Promise<FindWatcherResultModel> {
    const device = await this.findById(id);
    return this.watcher.findFromDeviceId(device.id);
  }

  @Get(':id/watcher/:watcher_id')
  public async findDeviceWatcherById(
    @Param('id') id: string,
    @Param('watcher_id') watcher_id: string,
  ): Promise<FindWatcherByIdResultModel> {
    return this.watcher.findByIdFromDeviceId(id, watcher_id);
  }
}
