import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, filter, Observable, of } from 'rxjs';
import { DatabaseError } from 'pg';
import { QueryFailedError } from 'typeorm';

function isPgError(error: any): error is DatabaseError {
  return (
    error !== null &&
    typeof error === 'object' &&
    'code' in error && // PostgreSQL errors typically have a "code" property
    'detail' in error // Most PostgreSQL errors also have a "detail" property
  );
}

export abstract class PgConstraintInterceptor implements NestInterceptor {
  constructor(
    readonly constraint: string,
    readonly exception: HttpException,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err: unknown) => {
        if (err instanceof QueryFailedError) {
          if (
            isPgError(err.driverError) &&
            err.driverError.constraint == this.constraint
          ) {
            throw this.exception;
          }
        }

        throw err;
      }),
    );
  }
}
