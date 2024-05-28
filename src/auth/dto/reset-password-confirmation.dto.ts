import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class ResetPasswordConfirmationDto {
    @IsEmail()
    @IsNotEmpty()
    readonly email: string;

    @IsNotEmpty()
    @IsString()
    readonly password: string;

    @IsNotEmpty()
    readonly code: string;
}