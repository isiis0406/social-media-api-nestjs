import { Body, Controller, Delete, Param, ParseIntPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import { CommentService } from './comment.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateCommentDto } from './create-comment.dto';
import { Request } from 'express';
import { UpdateCommentDto } from './update-comment.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Comments')	
@Controller('comments')
export class CommentController {
    constructor(private readonly commentService: CommentService) { }

    @ApiBearerAuth('access-token')	
    @UseGuards(AuthGuard('jwt'))
    @Post("create")
    create(@Body() createCommentDto: CreateCommentDto, @Req() req: Request) {
        const userId = req.user['userId']
        return this.commentService.create(createCommentDto, userId);
    }

    @ApiBearerAuth('access-token')	
    @UseGuards(AuthGuard('jwt'))
    @Put('update/:commentId')
    update(@Param('commentId', ParseIntPipe) commentId: number, @Req() req: Request, @Body() updateCommentDto: UpdateCommentDto){
        const userId = req.user['userId']
        return this.commentService.update(commentId,userId,updateCommentDto)
    }

    @ApiBearerAuth('access-token')	
    @UseGuards(AuthGuard('jwt'))
    @Delete('delete/:commentId')
    delete(@Param('commentId', ParseIntPipe) commentId: number, @Req() req: Request, @Body('postId') postId: number) {
        const userId = req.user['userId']
        return this.commentService.delete(commentId,userId,postId);
    }

}
