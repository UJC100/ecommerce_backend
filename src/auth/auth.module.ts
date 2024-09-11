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

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        global: true,
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{name: User.name, schema: user}]),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtTokens, AtStrategy, RtStrategy, GoogleStrategy],
})
export class AuthModule {}
