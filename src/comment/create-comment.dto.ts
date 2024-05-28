import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateCommentDto {
    @ApiProperty()	
    @IsString()
    @IsNotEmpty()
    readonly content: string

    @ApiProperty()	
    @IsNumber()
    @IsNotEmpty()
    readonly postId: number
}