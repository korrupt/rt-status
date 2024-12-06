import { DeviceEntity, WatcherEntity } from '@app/device-models';
import {
  CreateWatcherModel,
  CreateWatcherResultModel,
  DeleteWatcherResultModel,
  FindWatcherByIdResultModel,
  FindWatcherResultModel,
  UpdateWatcherModel,
  UpdateWatcherResultModel,
} from '@app/shared-models';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class WatcherService {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(WatcherEntity) private watcher: Repository<WatcherEntity>,
    @InjectRepository(DeviceEntity) private device: Repository<DeviceEntity>,
  ) {}

  public async create(
    model: CreateWatcherModel,
  ): Promise<CreateWatcherResultModel> {
    return this.watcher.save(model);
  }

  public async findById(id: string): Promise<FindWatcherByIdResultModel> {
    const found = await this.watcher.findOneBy({ id });

    if (!found) {
      throw new NotFoundException();
    }

    return found;
  }

  public async find(): Promise<FindWatcherResultModel> {
    return this.watcher.find();
  }

  public async update(
    id: string,
    model: UpdateWatcherModel,
  ): Promise<UpdateWatcherResultModel> {
    const watcher = await this.findById(id);

    return this.watcher.save({ ...watcher, ...model });
  }

  public async delete(id: string): Promise<DeleteWatcherResultModel> {
    const watcher = await this.findById(id);
    const deleted = await this.watcher.remove(watcher as WatcherEntity);

    const _id = deleted.id;

    return { id: _id };
  }
}
