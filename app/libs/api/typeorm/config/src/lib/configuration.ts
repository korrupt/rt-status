import { registerAs } from '@nestjs/config';

export default registerAs('typeorm', () => ({
  HOST: process.env['POSTGRES_HOST'],
  PORT: parseInt(process.env['POSTGRES_PORT'] || '5432', 10),
  USER: process.env['POSTGRES_USER'],
  PASSWORD: process.env['POSTGRES_PASSWORD'],
  DATABASE: process.env['POSTGRES_DATABASE'],
  SYNC: process.env['TYPEORM_SYNC'] == 'true',
}));
