import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Request, Response } from 'express';
import * as bcrypt from 'bcrypt'
import { JwtTokens } from 'src/helperFunctions/jwtToken';
import { UserLoginDto, UserSignUpDto } from 'src/users/dto/user-dto';
import { User, UserDocument } from 'src/users/schema/user-schema';
import { UsersService } from 'src/users/users.service';
import { access } from 'fs';
import { IsGoogleUser } from 'src/enum/google.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly userService: UsersService,
    private readonly jwtTokens: JwtTokens,
  ) {}

  async registerUser(payload: UserSignUpDto, res: Response) {
    const user = await this.userService.CreateUser(payload);
    const getTokens = await this.getAtAndRtTokens(
      user.id,
      user.email,
      user.role,
      res,
    );
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.refreshToken;

    return {
      userObject,
      getTokens
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
      getTokens
    };
  }

  async getNewAccessToken(req: Request) {
      const email = req.user['email']
      const rtToken = req.user['refreshToken']

      await this.jwtTokens.verifyRefreshToken(rtToken)

      const user = await this.userModel.findOne({ email })
      const decryptRtToken = await bcrypt.compare(rtToken, user.refreshToken)
      if(!decryptRtToken) throw new UnauthorizedException()
    

      const accessToken = await this.jwtTokens.generateAccessToken(
          user.id,
          user.email,
          user.role
      );
      
      return {
          accessToken
      }

  }

  async googleLogin(req: Request, res: Response) {
    const userEmail = req.user['email']
    const userName = req.user['firstName']
    

    const user = await this.userModel.findOne({email: userEmail})

    if (!user) {
      const createUser = await this.userModel.create({
        email: userEmail,
        name: userName
      })

      
      const getTokens = await this.getAtAndRtTokens(createUser.id, createUser.email, createUser.role, res)
      
      await this.userModel.findByIdAndUpdate(createUser.id, {isGoogle: IsGoogleUser.TRUE}) 
      const userObject = createUser.toObject();
       delete userObject.refreshToken;

       return {
         userObject,
         getTokens
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
        refreshToken
      }
    }
  }
}
