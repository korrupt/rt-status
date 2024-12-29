import { Body, Controller, Post } from '@nestjs/common';
import { AuthLocalService } from '../services';
import { AuthLocalLoginDto, AuthLocalRegisterDto } from '../dto';

@Controller('auth/local')
export class AuthLocalController {
  constructor(private auth_local: AuthLocalService) {}

  @Post('register')
  public async register(@Body() dto: AuthLocalRegisterDto) {
    return this.auth_local.register(dto);
  }

  @Post('login')
  public async login(@Body() dto: AuthLocalLoginDto) {
    return this.auth_local.login(dto);
  }
}
