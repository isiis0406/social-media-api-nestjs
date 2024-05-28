import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class ResetPassworDto {
    @ApiProperty()	
    @IsEmail()
    @IsNotEmpty()
    readonly email: string;
}