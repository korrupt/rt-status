import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../services';
import { JwtGuard } from '@app/auth-data-access';
import { AuthUser, GetAuth } from '@app/acl-data-access';
import { AclResource } from '@app/shared-models';
import { UpdateUserDto } from '../dto';

@Controller('user')
@UseGuards(JwtGuard)
export class UserController {
  constructor(private user: UserService) {}

  @Get()
  public async find(@GetAuth() auth: AuthUser) {
    return auth
      .read(AclResource.USER, null)
      .and(() => this.user.find())
      .filter();
  }

  @Get(':id')
  public async findOne(@GetAuth() auth: AuthUser, @Param('id') id: string) {
    return auth
      .read(AclResource.USER, { owner_id: id })
      .and(() => this.user.findById(id))
      .filter();
  }

  @Patch(':id')
  public async update(
    @GetAuth() auth: AuthUser,
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
  ) {
    return auth
      .update(AclResource.USER, { owner_id: id })
      .and((filteredDto) => this.user.update(id, filteredDto), dto)
      .filter();
  }

  @Delete('id')
  public async delete(@GetAuth() auth: AuthUser, @Param() id: string) {
    return auth
      .delete(AclResource.USER, { owner_id: id })
      .and(() => this.user.delete(id))
      .filter();
  }
}
