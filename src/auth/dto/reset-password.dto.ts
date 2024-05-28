import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class ResetPassworDto {
    @IsEmail()
    @IsNotEmpty()
    readonly email: string;
}