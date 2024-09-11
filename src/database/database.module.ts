import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Mongoose } from 'mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }), 
    MongooseModule.forRoot(
    process.env.DB_URI
    ),
  ],
})
export class DatabaseModule {}
