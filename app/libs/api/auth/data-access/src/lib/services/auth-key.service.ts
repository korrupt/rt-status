import { AuthkeyEntity } from '@app/auth-models';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthKeyService {
  constructor(
    @InjectRepository(AuthkeyEntity)
    private auth_key: Repository<AuthkeyEntity>,
  ) {}
}
