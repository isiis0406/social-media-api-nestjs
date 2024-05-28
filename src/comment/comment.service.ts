import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateCommentDto } from './create-comment.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateCommentDto } from './update-comment.dto';

@Injectable()

export class CommentService {


    constructor(private readonly prismaService: PrismaService) { }
    async create(creatCommentDto: CreateCommentDto, userId: number) {
        const { content, postId } = creatCommentDto

        //Trouver le post
        const post = await this.prismaService.post.findUnique({ where: { postId } })
        if (!post) throw new NotFoundException('Post not found');

        // Créer le commentaire
        const newComment = await this.prismaService.comment.create({
            data: {
                content,
                userId,
                postId
            }
        })
        return { data: { comment: newComment, message: 'Comment created' } }
    }
    async update(commentId: number, userId: any, updateCommentDto: UpdateCommentDto) {
        const { content, postId } = updateCommentDto;
        //Trouver le commentaire
        const comment = await this.prismaService.comment.findUnique({ where: { commentId } })
        if (!comment) throw new NotFoundException('Comment not found')

        //Verifier que le commentaire appartient au post 
        if (comment.postId !== postId) throw new UnauthorizedException('Post Id does not match')

        // Verifier que l'utilisateur est le créateur du commentaire
        if (comment.userId !== userId) throw new ForbiddenException('Forbidden action')

        //Mettre à jour le commentaire
        await this.prismaService.comment.update({ where: { commentId }, data: { content } })
        
        return { data: 'Comment updated' };
    }
    async delete(commentId: number, userId: number, postId: number) {
        //Trouver le commentaire
        const comment = await this.prismaService.comment.findUnique({ where: { commentId } })
        if (!comment) throw new NotFoundException('Comment not found')

        //Verifier que le commentaire appartient au post 
        if (comment.postId !== postId) throw new UnauthorizedException('Post Id does not match')

        // Verifier que l'utilisateur est le créateur du commentaire
        if (comment.userId !== userId) throw new ForbiddenException('Forbidden action')

        //Supprimer le commentaire
        await this.prismaService.comment.delete({ where: { commentId } })

        return { data: 'Comment deleted' }
    }


}
