import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { MailModule } from './mail/mail.module';
import { OtpModule } from './otp/otp.module';
import { SmsModule } from './sms/sms.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true
    }),
    UsersModule, DatabaseModule, AuthModule, MailModule, OtpModule, SmsModule],
  controllers: [],
  providers: [],
})
export class AppModule { }


