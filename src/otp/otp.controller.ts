import { Body, Controller, Post } from '@nestjs/common';
import { VerifyOtpDto } from './dto/otp.dto';
import { OtpService } from './otp.service';

@Controller('otp')
export class OtpController {
    constructor(private readonly otpService: OtpService) { }
    

    @Post('verify')
    async verifyOtp(@Body() payload: VerifyOtpDto) {
        return await this.otpService.verifyOtp(payload)
    }
}
