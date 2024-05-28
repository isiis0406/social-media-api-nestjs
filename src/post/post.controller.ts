import { Body, Controller, Delete, Put, Get, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PostService } from './post.service';
import { CreatePostDto } from './create-post.dto';
import { Request } from 'express';
import { UpdatePostDto } from './update-post.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Posts')	
@Controller('posts')
export class PostController {
    constructor(private readonly postService: PostService) { }


    @Get('/')
    getAll() {
        return this.postService.getAll();
    }

    @ApiBearerAuth('access-token')	
    @UseGuards(AuthGuard('jwt'))
    @Post('/create')
    create(@Body() createPostDto: CreatePostDto, @Req() req: Request) {
        const userId = req.user['userId']
        return this.postService.create(createPostDto, userId)
    }

    
    @ApiBearerAuth('access-token')	
    @UseGuards(AuthGuard('jwt'))
    @Put('/update/:postId')
    update(@Param('postId', ParseIntPipe) postId: number, @Body() updatePostDto: UpdatePostDto, @Req() req: Request) {
        const userId = req.user['userId']
        return this.postService.update(postId, userId, updatePostDto)
    }
    @ApiBearerAuth('access-token')	
    @UseGuards(AuthGuard('jwt'))
    @Delete('/delete/:postId')
    delete(@Param('postId', ParseIntPipe) postId: number, @Req() req: Request) {
        const userId = req.user['userId']
        return this.postService.delete(postId, userId)
    }

}
