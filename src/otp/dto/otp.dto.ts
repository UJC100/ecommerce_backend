import { IsEmail, IsEnum, IsNumber, IsString } from 'class-validator';
import { EmailType } from 'src/enum/otpType.enum';

export class CreateOtpDto {
  @IsEnum(EmailType)
  type: EmailType;

  @IsEmail()
  email: string;

  @IsNumber()
  code: number;
}

export class SendOtpDto {
  @IsEnum(EmailType)
  type: EmailType;

  @IsEmail()
  email: string;

  @IsString()
  name: string;
}


export class VerifyOtpDto {
  @IsNumber()
  code: number;
}
