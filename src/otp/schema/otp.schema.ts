import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { EmailType } from "src/enum/otpType.enum";

export type OtpDocument = HydratedDocument<Otp>;


@Schema({ expires: 300 })
export class Otp {
  @Prop({ required: true, enum: EmailType })
  type: String;

  @Prop({ required: true, unique: true })
  code: number;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ default: new Date() })
  createdAt: Date;

  @Prop({ default: Date.now(), expires: 300 })
  expiresAt: Date;
}

export const otpSchema = SchemaFactory.createForClass(Otp)