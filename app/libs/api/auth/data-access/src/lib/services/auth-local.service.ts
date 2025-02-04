import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';
import {
  ACL_DEFAULT_ROLE,
  AuthLocalLoginModel,
  AuthLocalRegisterModel,
  AuthLocalRegisterResultModel,
} from '@app/shared-models';
import { JwtService } from '@nestjs/jwt';
import { hash, compare } from 'bcryptjs';

import { UserEntity } from '@app/user-models';
import { AuthLocalEntity } from '@app/auth-models';
import { AuthConfigService } from '@app/auth-config';

@Injectable()
export class AuthLocalService {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    private jwtService: JwtService,
    private config: AuthConfigService,
  ) {}

  public async register(
    model: AuthLocalRegisterModel,
  ): Promise<AuthLocalRegisterResultModel> {
    await this.dataSource.transaction(async (em: EntityManager) => {
      // CREATE THE USER WITH DEFAULT ROLE
      const user = await em.save(UserEntity, {
        name: model.name,
        roles: [ACL_DEFAULT_ROLE],
      });
      // ATTACH AUTH OBJECT
      const h = await hash(model.password, this.config.BCRYPT_ROUNDS);
      const auth_local = await em.save(AuthLocalEntity, {
        email: model.email,
        hash: h,
        user_id: user.id,
      });
    });

    return { access_token: '' };
  }

  public async login(model: AuthLocalLoginModel) {
    const auth_local = await this.dataSource
      .getRepository(AuthLocalEntity)
      .findOneBy({ email: model.email });

    if (!auth_local) {
      throw new NotFoundException();
    }

    const matches = await compare(model.password, auth_local.hash);

    if (!matches) {
      throw new NotFoundException();
    }

    const user = await this.dataSource
      .getRepository(UserEntity)
      .findOneBy({ id: auth_local.user_id });

    if (!user) {
      throw new InternalServerErrorException(`AuthLocal has no user`);
    }

    const payload = await this.jwtService.signAsync({
      sub: user.id,
      roles: user.roles,
    });

    return { access_token: payload };
  }
}
