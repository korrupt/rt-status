import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthKeyService } from '../services/auth-key.service';
import type { Request } from 'express';

@Injectable()
export class AuthKeyGuard implements CanActivate {
  constructor(private authKeyService: AuthKeyService) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();

    const payload = req.headers['auth-key'];

    if (!payload || typeof payload == 'object') {
      throw new UnauthorizedException(`Missing auth-key header`);
    }

    const user = await this.authKeyService.signinWithAuthKey(payload);

    Object.defineProperty(req, 'user', {
      value: user,
      enumerable: true,
      configurable: true,
      writable: false,
    });

    return true;
  }
}
