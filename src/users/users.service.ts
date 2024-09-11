import { Injectable } from '@nestjs/common/decorators';
import { ConflictException, InternalServerErrorException } from '@nestjs/common/exceptions';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schema/user-schema';
import { Model } from 'mongoose';
import { UserSignUpDto } from './dto/user-dto';
import * as bcrypt from 'bcrypt'

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>
    ) { }
    
    async CreateUser(payload: UserSignUpDto) {
        
        try {
           const hashPassword = await bcrypt.hash(payload.password, 12)
           const savedUser = await this.userModel.create({
               ...payload,
               password: hashPassword
           })
           return savedUser
       } catch (error) {
           if (error.code === 11000) {
               throw new ConflictException(`${Object.keys(error.keyValue)} already exists`);
           } else {
               throw new InternalServerErrorException(error.response?.message || 'Internal Server Error')
         }
       }
    }
}
