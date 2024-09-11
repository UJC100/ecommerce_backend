import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) { }
    
    async sendMails(email: string, template: string, subject: string) {
         try {
           await this.mailerService.sendMail({
             to: email,
             from: `${process.env.MAILER_USER}`,
             subject: subject,
             html: template,
           });
         } catch (error) {
           console.log(error);
         }
    }
}
