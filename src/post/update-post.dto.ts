import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, Max } from "class-validator";

export class UpdatePostDto{
    @ApiProperty()	
    @IsString()
    @IsNotEmpty()
    readonly title: string

    @ApiProperty()	
     @IsString()
     @IsNotEmpty()
     @IsOptional()
     readonly body: string

}