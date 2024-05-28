import { Body, Controller, Delete, Post, Req, UseGuards } from '@nestjs/common';
import { SignUpDto } from './dto/signup.dto';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin.dto';
import { ResetPassworDto } from './dto/reset-password.dto';
import { ResetPasswordConfirmationDto } from './dto/reset-password-confirmation.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { DeleteAccountDto } from './dto/delete-account.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }
    @Post('/signup')
    signUp(@Body() signUpDto: SignUpDto) {
        return this.authService.signUp(signUpDto);
    }

    @Post('/signin')
    signIn(@Body() signInDto: SignInDto){
        return this.authService.signIn(signInDto);
    }

    @Post('reset-password')
    resetPassword(@Body() resetPasswordDto: ResetPassworDto){
        return this.authService.resetPassword(resetPasswordDto);
    }

    @Post('reset-password-confirmation')
    resetPasswordConfirmation(@Body() resetPasswordConfirmationDto: ResetPasswordConfirmationDto){
        return this.authService.resetPasswordConfirmationDto(resetPasswordConfirmationDto)
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete('delete')
    deleteAccount(@Req() req: Request, @Body() deleteAccountDto : DeleteAccountDto){
        const userId = req.user['userId']
        return this.authService.deleteAccount(userId,deleteAccountDto);
    }
}
