import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TypeormConfigService {
  constructor(private conf: ConfigService) {}

  get HOST(): string {
    /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
    return this.conf.get<string>('typeorm.HOST')!;
  }

  get PORT(): number {
    /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
    return this.conf.get<number>('typeorm.PORT')!;
  }

  get USER(): string {
    /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
    return this.conf.get<string>('typeorm.USER')!;
  }

  get PASSWORD(): string {
    /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
    return this.conf.get<string>('typeorm.PASSWORD')!;
  }

  get DATABASE(): string {
    /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
    return this.conf.get<string>('typeorm.DATABASE')!;
  }

  get SYNC(): boolean {
    /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
    return this.conf.get<boolean>('typeorm.SYNC')!;
  }
}
