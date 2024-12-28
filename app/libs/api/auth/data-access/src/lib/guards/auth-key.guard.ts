import { AuthkeyEntity } from '@app/auth-models';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthKeyGuard implements CanActivate {
  constructor(
    @InjectRepository(AuthkeyEntity)
    private auth_key: Repository<AuthkeyEntity>,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();

    const payload = req.headers.get('auth-key');

    if (!payload) {
      throw new UnauthorizedException(`Missing auth-key header`);
    }

    const auth_key = await this.auth_key.findOneBy({ key: payload });

    if (!auth_key) {
      throw new UnauthorizedException(`Auth key not valid`);
    }

    if (auth_key.expires_at && Date.now() > auth_key.expires_at.getTime()) {
      throw new UnauthorizedException(`Key expired`);
    }

    if (auth_key.revoked_at) {
      throw new UnauthorizedException(`Key revoked`);
    }

    return true;
  }
}
