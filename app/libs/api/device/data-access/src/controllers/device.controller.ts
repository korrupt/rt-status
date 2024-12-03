import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { DeviceService } from "../services/device.service";
import { CreateDeviceDto, UpdateDeviceDto } from "../dto";
import { DeleteDeviceResultModel, FindDeviceByIdResultModel, FindDeviceResultModel } from "@app/shared-models";


@Controller('device')
export class DeviceController {
  constructor(private device: DeviceService){}

  @Post()
  public async create(@Body() dto: CreateDeviceDto) {
    return this.device.create(dto);
  }

  @Get()
  public async find(@Query() params: unknown): Promise<FindDeviceResultModel> {
    return this.device.find(params);
  }

  @Get(':id')
  public async findById(@Param('id') id: string): Promise<FindDeviceByIdResultModel> {
    return this.device.findById(id);
  }

  @Patch(':id')
  public async update(@Param('id') id: string, @Body() dto: UpdateDeviceDto): Promise<FindDeviceByIdResultModel> {
    return this.device.update(id, dto);
  }

  @Delete(':id')
  public async delete(@Param('id') id: string): Promise<DeleteDeviceResultModel> {
    return this.device.delete(id);
  }
}
