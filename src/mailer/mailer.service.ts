import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
@Injectable()
export class MailerService {
    private async transporter (){
        const testAccount = await nodemailer.createTestAccount();
        const transporter = nodemailer.createTransport({
            host: "localhost",
            port: 1025,
            ignoreTLS: true,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass
            }
        })
        return transporter;
    }

    async sendSignUpConfirmation(userEmail: string){
        (await this.transporter()).sendMail({
            from: "socialapp@localhost.com",
            to: userEmail,
            subject: "Inscription",
            html: "<h3>Confirmation inscription</h3>"
        })
    }
    async sendResetPassword(userEmail: string, url:string, code: string){
        (await this.transporter()).sendMail({
            from: "socialapp@localhost.com",
            to: userEmail,
            subject: "Reset password ",
            html: `
            <a href="${url}">Reset password</a>
            <p>Secret code <strong>${code}</strong> </p>
            <p> Code will expires in 15min </p>
            `
        })
    }
 
}
