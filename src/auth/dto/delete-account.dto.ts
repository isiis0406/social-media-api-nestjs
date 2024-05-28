import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class DeleteAccountDto {
    @ApiProperty()	
    @IsString()
    @IsNotEmpty()
    readonly password: string;
}