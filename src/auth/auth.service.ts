import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { SignUpDto } from './dto/signup.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as speakeasy from 'speakeasy'
import { MailerService } from 'src/mailer/mailer.service';
import { SignInDto } from './dto/signin.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ResetPassworDto } from './dto/reset-password.dto';
import { ResetPasswordConfirmationDto } from './dto/reset-password-confirmation.dto';
import { DeleteAccountDto } from './dto/delete-account.dto';

@Injectable()
export class AuthService {

    constructor(private readonly prismaService: PrismaService,
        private readonly mailerService: MailerService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) { }
    async signUp(signUpDto: SignUpDto) {
        const { email, username, password } = signUpDto;
        //** Verifier si l'utilisateur existe déjà
        const user = await this.prismaService.user.findUnique({ where: { email } })

        if (user) throw new ConflictException('User already exists');
        //** Hasher le mot de passe
        const salt = bcrypt.genSaltSync(10);
        const hash = await bcrypt.hash(password, salt)

        //** Enregistrer l'utilisateur dans la base de données
        await this.prismaService.user.create({
            data: {
                email,
                username,
                password: hash
            }
        })

        //**Envoyer un mail de confirmation
        await this.mailerService.sendSignUpConfirmation(email);

        //** Retourner l'utilisateur
        return {
            data: {
                email,
                username
            },
            message: 'User created successfully'
        }

    }
    async signIn(signInDto: SignInDto) {
        const { email, password } = signInDto;

        // Vérifier si l'user est déjà inscrit
        const user = await this.prismaService.user.findUnique({ where: { email } })
        if (!user) throw new NotFoundException('User not found')

        // Comparer le mot de passe
        const match = await bcrypt.compare(password, user.password);

        if (!match) throw new UnauthorizedException('Wrong credentials')

        // Générer un token JWT
        const payload = {
            sub: user.email,
            email: user.email
        }
        const token = this.jwtService.sign(
            payload, {
            expiresIn: "2h",
            secret: this.configService.get('JWT_SECRET_KEY')
        })

        //Retourner le token 
        return {
            token, user: {
                username: user.username,
                email: user.email
            }
        }


    }
    async resetPassword(resetPasswordDto: ResetPassworDto) {
        const { email } = resetPasswordDto;

        //Vérifier si l'utilisateur existe
        const user = await this.prismaService.user.findUnique({ where: { email } })
        if (!user) throw new NotFoundException('User not found');

        const code = speakeasy.totp({
            secret: this.configService.get('OTP_CODE'),
            digits: 5,
            step: 60 * 15,
            encoding: 'base32'
        })
        const url = 'http://localhost:3000/auth/reset-password-confirmation'

        //Envoyer le mail de reset
        await this.mailerService.sendResetPassword(email, url, code);
        return { data: 'Reset password mail has been sent' }
    }
    async resetPasswordConfirmationDto(resetPasswordConfirmationDto: ResetPasswordConfirmationDto) {
        const { email, password, code } = resetPasswordConfirmationDto;

        //Vérifier si l'utilisateur existe
        const user = await this.prismaService.user.findUnique({ where: { email } })
        if (!user) throw new NotFoundException('User not found');

        //Verifier si le code est valid
        const match = speakeasy.totp.verify({
            secret: this.configService.get('OTP_CODE'),
            token: code,
            digits: 5,
            step: 60 * 15,
            encoding: 'base32'
        })

        if (!match) throw new UnauthorizedException('Invalid/Expired token');

        //Hasher le nouveau password
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        //Modifier le mot de passe
        await this.prismaService.user.update({ where: { email }, data: { password: hash } })
        return { data: 'Password updated' };
    }
    async deleteAccount(userId: number, deleteAccountDto: DeleteAccountDto) {
        const { password } = deleteAccountDto;

        //Vérifier si l'utilisateur existe
        const user = await this.prismaService.user.findUnique({ where: { userId } })
        if (!user) throw new NotFoundException('User not found');

        //Verifier le mot de passe
        const match = await bcrypt.compare(password, user.password);

        if (!match) throw new UnauthorizedException('Wrong credentials')

        // Supprimer l'user 
        await this.prismaService.user.delete({ where: { userId } });
        return { data : "User successfully deleted"};
    }
}
