import { Controller } from '@nestjs/common';
import { UserService } from '../services';

@Controller('user')
export class UserController {
  constructor(private user: UserService) {}
}
