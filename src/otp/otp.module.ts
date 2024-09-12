import { Module, forwardRef } from '@nestjs/common';
import { OtpController } from './otp.controller';
import { OtpService } from './otp.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Otp, otpSchema } from './schema/otp.schema';
import { MailModule } from 'src/mail/mail.module';
import { User, user } from 'src/users/schema/user-schema';
import { AuthService } from 'src/auth/auth.service';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Otp.name, schema: otpSchema },
      { name: User.name, schema: user },
    ]),
    MailModule,
    UsersModule,
    forwardRef(() => AuthModule)
  ],
  controllers: [OtpController],
  providers: [OtpService],
  exports: [OtpService],
})
export class OtpModule {}
