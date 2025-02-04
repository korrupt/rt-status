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
  AclResource,
  DeleteDeviceResultModel,
  FindDeviceByIdResultModel,
  FindDeviceResultModel,
  FindWatcherByIdResultModel,
  FindWatcherResultModel,
} from '@app/shared-models';
import { WatcherService } from '../services';
import { JwtGuard } from '@app/auth-data-access';
import { AuthUser, GetAuth } from '@app/acl-data-access';

@Controller('device')
@UseGuards(JwtGuard)
export class DeviceController {
  constructor(
    private device: DeviceService,
    private watcher: WatcherService,
  ) {}

  @Post()
  public async create(@GetAuth() auth: AuthUser, @Body() dto: CreateDeviceDto) {
    return auth
      .create(AclResource.DEVICE)
      .withFilteredDto(dto, 'create')
      .withFunction((_dto) => this.device.create(_dto))
      .filter();
  }

  @Get()
  public async find(
    @GetAuth() auth: AuthUser,
    @Query() params: object,
  ): Promise<FindDeviceResultModel> {
    return auth
      .read(AclResource.DEVICE)
      .withFilteredDto(params)
      .withFunction((dto) => this.device.find(dto))
      .filter();
  }

  @Get(':id')
  public async findById(
    @GetAuth() auth: AuthUser,
    @Param('id') id: string,
  ): Promise<FindDeviceByIdResultModel> {
    return auth
      .read(AclResource.DEVICE)
      .withFunction(() => this.device.findById(id))
      .filter();
  }

  @Patch(':id')
  public async update(
    @GetAuth() auth: AuthUser,
    @Param('id') id: string,
    @Body() dto: UpdateDeviceDto,
  ): Promise<FindDeviceByIdResultModel> {
    return auth
      .update(AclResource.DEVICE)
      .withFilteredDto(dto, 'update')
      .withFunction((dto) => this.device.update(id, dto))
      .filter();
  }

  @Delete(':id')
  public async delete(
    @GetAuth() auth: AuthUser,
    @Param('id') id: string,
  ): Promise<DeleteDeviceResultModel> {
    return auth
      .delete(AclResource.DEVICE)
      .withFunction(() => this.device.delete(id))
      .get();
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
    @GetAuth() auth: AuthUser,
    @Param('id') id: string,
  ): Promise<FindWatcherResultModel> {
    const device = await this.findById(auth, id);
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
