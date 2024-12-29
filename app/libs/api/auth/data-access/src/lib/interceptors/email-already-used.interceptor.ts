import { PgConstraintInterceptor } from '@app/typeorm-data-access';
import { ConflictException, Injectable } from '@nestjs/common';
import { AuthLocalEntity } from '@app/auth-models';

@Injectable()
export class EmailAlreadyUsedInterceptor extends PgConstraintInterceptor {
  constructor() {
    super(
      AuthLocalEntity.UQ_AUTH_LOCAL_EMAIL,
      new ConflictException('Email already in use'),
    );
  }
}
