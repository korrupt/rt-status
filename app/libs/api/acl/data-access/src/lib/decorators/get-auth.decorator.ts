// export const GetAuth
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetAuth = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
