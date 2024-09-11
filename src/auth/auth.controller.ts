import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserLoginDto, UserSignUpDto } from 'src/users/dto/user-dto';
import { Response, Request } from 'express';
import { JwtRefreshTokenGuard } from './jwt-auth/jwtRt.guard';
import { AuthGuard } from '@nestjs/passport';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async register(
    @Body() payload: UserSignUpDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.authService.registerUser(payload, res);
  }

  @Post('login')
  async Login(
    @Body() payload: UserLoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.authService.login(payload, res);
  }

  @UseGuards(JwtRefreshTokenGuard)
  @Post('refreshToken')
  async refreshToken(@Req() req: Request) {
    return await this.authService.getNewAccessToken(req);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req: Request) {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleLogin(@Req() req: Request, @Res({passthrough: true}) res: Response) {
      return this.authService.googleLogin(req, res)
     }
    
}
