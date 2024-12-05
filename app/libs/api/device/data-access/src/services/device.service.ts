import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { DeviceEntity } from '@app/device-models';
import {
  CreateDeviceModel,
  CreateDeviceResultModel,
  DeleteDeviceResultModel,
  FindDeviceByIdResultModel,
  FindDeviceResultModel,
  UpdateDeviceModel,
} from '@app/shared-models';

@Injectable()
export class DeviceService {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(DeviceEntity) private device: Repository<DeviceEntity>,
  ) {}

  public async create(
    model: CreateDeviceModel,
  ): Promise<CreateDeviceResultModel> {
    return this.device.save(model);
  }

  public async find(model: unknown = {}): Promise<FindDeviceResultModel> {
    const qb = this.dataSource.createQueryBuilder();

    return qb.select('*').from(DeviceEntity, 'd').getRawMany();
  }

  public async findById(id: string): Promise<FindDeviceByIdResultModel> {
    const found = await this.device.findOneBy({ id });

    if (!found) {
      throw new NotFoundException();
    }

    return found;
  }

  public async update(
    id: string,
    model: UpdateDeviceModel,
  ): Promise<FindDeviceByIdResultModel> {
    const found = await this.findById(id);

    return this.device.save({ ...found, ...model });
  }

  public async delete(id: string): Promise<DeleteDeviceResultModel> {
    const found = await this.findById(id);
    const removed = await this.device.remove(found as DeviceEntity);

    const _id = removed.id;

    return { id: _id };
  }
}
