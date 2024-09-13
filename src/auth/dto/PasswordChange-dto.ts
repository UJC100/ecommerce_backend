import { IsNotEmpty, IsString } from "class-validator";



export class ResetPasswordDto {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsString()
  @IsNotEmpty()
  newPassword: string;

  @IsString()
  @IsNotEmpty()
  confirmPassword: string;

  @IsString()
  @IsNotEmpty()
  encryptionKey: string;
}

export class ForgotPasswordDto {
    @IsNotEmpty()
    @IsString()
    email: string;
}

