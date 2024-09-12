import { HttpException, HttpStatus, Inject, Injectable, InternalServerErrorException, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Otp, OtpDocument } from './schema/otp.schema';
import { Model } from 'mongoose';
import { MailService } from 'src/mail/mail.service';
import { CreateOtpDto, SendOtpDto, VerifyOtpDto } from './dto/otp.dto';
import { BaseHelper } from 'src/helperFunctions/helper.utils';
import { EmailType } from 'src/enum/otpType.enum';
import { VerifyEmailTemplate } from 'src/mail/templates/verifyEmail';
import { User, UserDocument } from 'src/users/schema/user-schema';
import { AuthService } from 'src/auth/auth.service';
import { WelcomeEmailTemplate } from 'src/mail/templates/welcomeEmail';
import { EmailSubject } from 'src/enum/subject.enum';

@Injectable()
export class OtpService {
  constructor(
    @InjectModel(Otp.name) private readonly otpModel: Model<OtpDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly mailService: MailService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  async createOtp(payload: CreateOtpDto) {
    const otp = await this.otpModel.findOne({ email: payload.email });

    if (!otp) {
      return this.otpModel.create(payload);
    }
    return await this.otpModel.findOneAndUpdate(
      { email: payload.email },
      payload,
      { upsert: true, new: true },
    );
  }

  async sendOtp(payload: SendOtpDto) {
    const { email, type, name } = payload;

    const code = BaseHelper.generateOtp();

    let template: string;
    let subject: string;

    switch (type) {
      case EmailType.VERIFY_USER:
        template = VerifyEmailTemplate(code, name);
        subject = EmailSubject.EMAIL_VERIFICATION;
        break;
    }

    await this.createOtp({
      email,
      type,
      code,
    });

    if (!code)
      throw new InternalServerErrorException(
        `Unable to generate otp. Please try again later`,
      );

    await this.mailService.sendMails(email, template, subject);
  }

  async verifyOtp(payload: VerifyOtpDto) {
    const { code } = payload;
    const otp = await this.otpModel.findOne({ code });

    if (!otp) {
      throw new HttpException('Invalid or expired Otp', HttpStatus.NOT_FOUND);
    }

      const user = await this.userModel.findOneAndUpdate({ email: otp.email }, { $set: { isVerified: true } }, {new: true});
 
    console.log(user);
    await this.authService.checkUserVerification(undefined, 'verified');

    const template = WelcomeEmailTemplate(user.name);
    await this.mailService.sendMails(
      user.email,
      template,
      EmailSubject.WELCOME_MAIL,
    );

    return {
      message: `Verification successful`,
    };
  }
}
