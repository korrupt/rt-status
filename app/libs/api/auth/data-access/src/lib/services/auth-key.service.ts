import { AuthkeyEntity } from '@app/auth-models';
import {
  CreateAuthKeyModel,
  CreateAuthKeyResultModel,
} from '@app/shared-models';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthKeyService {
  constructor(
    @InjectRepository(AuthkeyEntity)
    private auth_key: Repository<AuthkeyEntity>,
  ) {}

  public async createAuthkey(
    model: CreateAuthKeyModel,
  ): Promise<CreateAuthKeyResultModel> {
    return await this.auth_key.save(model);
  }

  public async signinWithAuthKey(key: string): Promise<{ watcher_id: string }> {
    const auth_key = await this.auth_key.findOneBy({ key });

    if (!auth_key) {
      throw new UnauthorizedException(`Auth key not valid`);
    }

    if (auth_key.expires_at && Date.now() > auth_key.expires_at.getTime()) {
      throw new UnauthorizedException(`Key expired`);
    }

    if (auth_key.revoked_at) {
      throw new UnauthorizedException(`Key revoked`);
    }

    await this.auth_key.update({ key }, { last_used_at: new Date() });

    return { watcher_id: auth_key.watcher_id };
  }
}
