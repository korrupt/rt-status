import { AuthkeyEntity } from '@app/auth-models';
import {
  CreateAuthKeyModel,
  CreateAuthKeyResultModel,
} from '@app/shared-models';
import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthKeyService {
  constructor(
    @InjectRepository(AuthkeyEntity)
    private auth_key: Repository<AuthkeyEntity>,
  ) {}

  public async createAuthkey(
    model: CreateAuthKeyModel,
  ): Promise<CreateAuthKeyResultModel> {
    const max_attempts = 5;
    let attempts = 0;

    let entity: AuthkeyEntity | null = null;
    while (attempts < max_attempts) {
      try {
        const key = randomBytes(32).toString('hex');
        entity = await this.auth_key.save({
          ...model,
          key,
          last_used_at: new Date(),
        });
        break;
      } catch (err: unknown) {
        console.error(err);

        entity = null;
        attempts++;
      }
    }

    if (!entity) {
      throw new InternalServerErrorException(`Could not generate key`);
    }

    return entity;
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
