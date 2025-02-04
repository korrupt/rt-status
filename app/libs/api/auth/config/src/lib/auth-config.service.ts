/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthConfigService {
  constructor(private config: ConfigService) {}

  get JWT_EXPIRES_IN(): string {
    return this.config.get('auth.JWT_EXPIRES_IN')!;
  }

  get JWT_SECRET(): string {
    return this.config.get('auth.JWT_SECRET')!;
  }

  get BCRYPT_ROUNDS(): string {
    return this.config.get('auth.BCRYPT_ROUNDS')!;
  }
}
