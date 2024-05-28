import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Max } from "class-validator";

export class CreatePostDto{
    @ApiProperty()	
    @IsString()
    @IsNotEmpty()
    readonly title: string

    @ApiProperty()	
     @IsString()
     @IsNotEmpty()
     readonly body: string

}