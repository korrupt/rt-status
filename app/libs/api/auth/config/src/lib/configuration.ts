import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  JWT_EXPIRES_IN: process.env['AUTH_JWT_EXPIRES_IN'],
  JWT_SECRET: process.env['AUTH_JWT_SECRET'],
  BCRYPT_ROUNDS: process.env['AUTH_BCRYPT_ROUNDS'],
}));
