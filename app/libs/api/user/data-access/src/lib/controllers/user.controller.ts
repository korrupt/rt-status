import { Controller, UseGuards } from '@nestjs/common';
import { UserService } from '../services';
import { JwtGuard } from '@app/auth-data-access';

@Controller('user')
@UseGuards(JwtGuard)
export class UserController {
  constructor(private user: UserService) {}
}
