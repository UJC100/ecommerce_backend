import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Request, Response } from 'express';
import * as bcrypt from 'bcrypt';
import { JwtTokens } from 'src/helperFunctions/jwtToken';
import { UserLoginDto, UserSignUpDto } from 'src/users/dto/user-dto';
import { User, UserDocument } from 'src/users/schema/user-schema';
import { UsersService } from 'src/users/users.service';
import { access } from 'fs';
import { IsGoogleUser } from 'src/enum/google.enum';
import { OtpService } from 'src/otp/otp.service';
import { EmailType } from 'src/enum/otpType.enum';
import { ForgotPasswordDto, ResetPasswordDto } from './dto/PasswordChange-dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly userService: UsersService,
    private readonly jwtTokens: JwtTokens,
    private readonly otpService: OtpService,
  ) {}

  async registerUser(payload: UserSignUpDto, res: Response) {
    const user = await this.userService.CreateUser(payload);
    const getTokens = await this.getAtAndRtTokens(
      user.id,
      user.email,
      user.role,
      res,
    );

    await this.otpService.sendOtp({
      email: user.email,
      type: EmailType.VERIFY_USER,
      name: user.name,
      phoneNumber: user.phoneNumber,
    });
    await this.checkUserVerification(user.id);

    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.refreshToken;

    return {
      userObject,
      getTokens,
      message: `Verification code has been sent to ${user.email}`,
    };
  }

  async login(payload: UserLoginDto, res: Response) {
    const { email, password } = payload;

    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new HttpException('invalid credentials', HttpStatus.NOT_FOUND);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new HttpException('invalid credentials', HttpStatus.NOT_FOUND);
    }

    const getTokens = await this.getAtAndRtTokens(
      user.id,
      user.email,
      user.role,
      res,
    );

    return {
      message: 'Login Success',
      getTokens,
    };
  }

  async getNewAccessToken(req: Request) {
    const email = req.user['email'];
    const rtToken = req.user['refreshToken'];

    await this.jwtTokens.verifyRefreshToken(rtToken);

    const user = await this.userModel.findOne({ email });
    const decryptRtToken = await bcrypt.compare(rtToken, user.refreshToken);
    if (!decryptRtToken) throw new UnauthorizedException();

    const accessToken = await this.jwtTokens.generateAccessToken(
      user.id,
      user.email,
      user.role,
    );

    return {
      accessToken,
    };
  }

  async googleLogin(req: Request, res: Response) {
    const userEmail = req.user['email'];
    const userName = req.user['firstName'];

    const user = await this.userModel.findOne({ email: userEmail });

    if (!user) {
      const createUser = await this.userModel.create({
        email: userEmail,
        name: userName,
      });

      const getTokens = await this.getAtAndRtTokens(
        createUser.id,
        createUser.email,
        createUser.role,
        res,
      );

      await this.userModel.findByIdAndUpdate(createUser.id, {
        isGoogle: IsGoogleUser.TRUE,
      });
      const userObject = createUser.toObject();
      delete userObject.refreshToken;

      return {
        userObject,
        getTokens,
      };
    }

    const getTokens = await this.getAtAndRtTokens(
      user.id,
      user.email,
      user.role,
      res,
    );

    const userObject = user.toObject();
    delete userObject.refreshToken;

    return {
      userObject,
      getTokens,
    };
  }

  async forgotPassword(payload: ForgotPasswordDto) {
    const { email } = payload;
    const user = await this.userModel.findOne({ email });

    if (!user)
      throw new HttpException(
        `Could not find email please signup`,
        HttpStatus.NOT_FOUND,
      );

    await this.otpService.sendOtp({
      email: user.email,
      type: EmailType.FORGOT_PASSWORD,
      name: user.name,
    });

    return {
      message: `Password reset Otp has been sent to your email`,
    };
  }

  async resetPassword(payload: ResetPasswordDto) {
    const { newPassword, confirmPassword, email, encryptionKey } = payload;
    const user = await this.userModel.findOne({ email });
    const Otp = await this.otpService.extractKey(user.email)

    if (!user)
      throw new HttpException(
        `Could not find email please signup`,
        HttpStatus.NOT_FOUND,
      );

    if (newPassword !== confirmPassword) throw new HttpException(`Passwords do not match`, HttpStatus.BAD_REQUEST);
    
    if (encryptionKey !== Otp.encryptionKey)
      throw new HttpException(`invalid key`, HttpStatus.BAD_REQUEST);

    const hashPassword = await bcrypt.hash(newPassword, 12);
    const updatedUser = await this.userModel.findOneAndUpdate(
      { email },
      { $set: { password: hashPassword } },
      { new: true },
    );

    return updatedUser;
  }

  /*++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */

  async getAtAndRtTokens(id: string, email: string, role: string, res) {
    const accessToken = await this.jwtTokens.generateAccessToken(
      id,
      email,
      role,
    );
    const refreshToken = await this.jwtTokens.generateRefreshToken(
      id,
      email,
      role,
    );

    const hashRtToken = await bcrypt.hash(refreshToken, 12);

    await this.userModel.findByIdAndUpdate(id, {
      refreshToken: hashRtToken,
    });

    res.cookie('jwtRt', refreshToken, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000,
    });

    return {
      token: {
        accessToken,
        refreshToken,
      },
    };
  }

  async checkUserVerification(userId?: string, status?: string) {
    let timer = setTimeout(async () => {
      const user = await this.userModel.findById(userId);
      if (user && user.isVerified === false) {
        console.log(user);
        await this.userModel.findByIdAndDelete(userId);
        console.log(
          `user ${user.email} was delete due to lack of verification`,
        );
      }
      return timer;
    }, 600000);

    if (status === 'verified') {
      clearTimeout(timer);
      console.log(`timer cleared`);
    }
  }
}
