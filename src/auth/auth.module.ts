import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtTokens } from 'src/helperFunctions/jwtToken';
import { PassportStrategy } from '@nestjs/passport';
import { AtStrategy } from './jwt-auth/jwtAt.strategy';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { User, user } from 'src/users/schema/user-schema';
import { RtStrategy } from './jwt-auth/jwtRt.strategy';
import { GoogleStrategy } from './jwt-auth/google.auth.strategy';
import { OtpModule } from 'src/otp/otp.module';
import { OtpService } from 'src/otp/otp.service';
import { Otp, otpSchema } from 'src/otp/schema/otp.schema';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        global: true,
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: user },
      { name: Otp.name, schema: otpSchema },
    ]),
    UsersModule,
    OtpModule,
    MailModule
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtTokens,
    AtStrategy,
    RtStrategy,
    GoogleStrategy,
    OtpService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
