import { HttpException, Injectable } from '@nestjs/common';
import axios from 'axios'
import { response } from 'express';

@Injectable()
export class SmsService {
  private readonly apiKey = process.env.SMS_API_KEY;
    private readonly baseUrl = process.env.BASE_URL;
    
    async sendSms(to: string, message: string) {
        const payload = {
            to, 
            from: 'Termii',
            sms: message,
            type: 'plain',
            channel: 'generic',
            api_key:this.apiKey
        }

        try {
            const response = await axios.post(this.baseUrl, payload)
            console.log(response.data)
            return response.data
        } catch (error) {
            throw new HttpException(error.response.data, error.response.status);
        }
    }
}
