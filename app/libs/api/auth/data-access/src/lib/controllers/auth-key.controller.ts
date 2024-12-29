import { Body, Controller, Post } from '@nestjs/common';
import { AuthKeyService } from '../services';
import { CreateAuthkeyDto } from '../dto';

@Controller('auth-key')
export class AuthKeyController {
  constructor(private authKeyService: AuthKeyService) {}

  @Post()
  public async createAuthKey(@Body() dto: CreateAuthkeyDto) {
    return this.authKeyService.createAuthkey(dto);
  }
}
