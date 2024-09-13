import { IsEmail, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { EmailType } from 'src/enum/otpType.enum';

export class CreateOtpDto {
  @IsEnum(EmailType)
  type: EmailType;

  @IsEmail()
  email: string;

  @IsNumber()
  code: number;

  @IsString()
  @IsOptional()
  encryptionKey: string;
}

export class SendOtpDto {
  @IsEnum(EmailType)
  type: EmailType;

  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsString()
  phoneNumber?: string;

}


export class VerifyOtpDto {
  @IsNumber()
  code: number;
}
