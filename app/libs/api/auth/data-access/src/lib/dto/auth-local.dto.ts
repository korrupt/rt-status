import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import {
  AuthLocalLoginModel,
  AuthLocalRegisterModel,
} from '@app/shared-models';

export class AuthLocalRegisterDto implements AuthLocalRegisterModel {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @IsString()
  password!: string;
}

export class AuthLocalLoginDto implements AuthLocalLoginModel {
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @IsString()
  password!: string;
}
