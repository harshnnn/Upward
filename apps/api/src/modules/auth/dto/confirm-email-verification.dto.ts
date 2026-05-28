import { IsEmail, IsString } from 'class-validator';

export class ConfirmEmailVerificationDto {
  @IsEmail()
  email!: string;

  @IsString()
  token!: string;
}
