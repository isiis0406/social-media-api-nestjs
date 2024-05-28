import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class ResetPasswordConfirmationDto {
    @ApiProperty()	
    @IsEmail()
    @IsNotEmpty()
    readonly email: string;

    @ApiProperty()	
    @IsNotEmpty()
    @IsString()
    readonly password: string;

    @ApiProperty()	
    @IsNotEmpty()
    readonly code: string;
}