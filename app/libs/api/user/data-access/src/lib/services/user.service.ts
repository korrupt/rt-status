import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { UserEntity } from '@app/user-models';
import {
  CreateUserModel,
  CreateUserResultModel,
  DeleteUserModel,
  FindUserByIdResultModel,
  FindUserResultModel,
  UpdateUserModel,
} from '@app/shared-models';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private user: Repository<UserEntity>,
    @InjectDataSource() private dataSource: DataSource,
  ) {}

  public async create(model: CreateUserModel): Promise<CreateUserResultModel> {
    return this.user.save(model);
  }

  public async find(): Promise<FindUserResultModel> {
    return this.user.find();
  }

  public async findById(id: string): Promise<FindUserByIdResultModel> {
    const found = await this.user.findOneBy({ id });

    if (!found) {
      throw new NotFoundException();
    }

    return found;
  }

  public async update(
    id: string,
    model: UpdateUserModel,
  ): Promise<FindUserByIdResultModel> {
    const found = await this.findById(id);
    return this.user.save({ ...found, model });
  }

  public async delete(id: string): Promise<DeleteUserModel> {
    const found = await this.findById(id);
    const deleted = await this.user.remove(<UserEntity>found);

    return { id: deleted.id };
  }
}
