import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { IsGoogleUser } from "src/enum/google.enum";
import { UserRoleEnum } from "src/enum/userRole.enum";



export type UserDocument = HydratedDocument<User>

@Schema({timestamps: true})
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  password: string;

  @Prop({ enum: IsGoogleUser, default: IsGoogleUser.FALSE })
  isGoogle: string;

  @Prop({ default: null })
  refreshToken: string;

  @Prop({ enum: UserRoleEnum, default: UserRoleEnum.USER })
  role: string;

  @Prop({ default: false })
  isVerified: boolean;
}

export const user = SchemaFactory.createForClass(User)