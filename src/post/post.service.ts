import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './create-post.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdatePostDto } from './update-post.dto';

@Injectable()
export class PostService {


    constructor(private readonly prismaService: PrismaService) { }
    async getAll() {
        const posts = await this.prismaService.post.findMany({
            include: {
                user: {
                    select: {
                        username: true,
                        email: true,
                        password: false
                    }
                },
                comments: {
                    include: {
                        user: {
                            select: {
                                username: true,
                                email: true,
                                password: false
                            }
                        }
                    }
                }
            }
        });
        if (!posts) throw new NotFoundException('Posts not founded');

        return posts
    }

    async create(createPostDto: CreatePostDto, userId: any) {
        const { title, body } = createPostDto;
        const newpost = await this.prismaService.post.create({ data: { body, title, userId } })
        return { data: newpost, message: 'Post created successfully' }
    }

    async update(postId: number, userId: any, updatePostDto: UpdatePostDto) {
        const { title, body } = updatePostDto
        //Verifier si la publication existe
        const post = await this.prismaService.post.findUnique({ where: { postId } })
        if (!post) throw new NotFoundException('Post not found')

        //Verifier si l'user est le créateur du post
        if (post.userId != userId) throw new ForbiddenException('Forbidden action')

        //Modifier la publication
        await this.prismaService.post.update({ where: { postId }, data: { ...updatePostDto } })
        return { data: 'Post updated' }
    }

    async delete(postId: number, userId: any) {
        //Verifier si la publication existe
        const post = await this.prismaService.post.findUnique({ where: { postId } })
        if (!post) throw new NotFoundException('Post not found')

        //Verifier si l'user est le créateur du post
        if (post.userId != userId) throw new ForbiddenException('Forbidden action')

        // Supprimer la publication
        await this.prismaService.post.delete({ where: { postId } })
        return { data: 'Post deleted' }
    }
}
