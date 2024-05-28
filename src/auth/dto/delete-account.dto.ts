import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class DeleteAccountDto {
    @IsString()
    @IsNotEmpty()
    readonly password: string;
}