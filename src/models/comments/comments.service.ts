import { HttpException, Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PrismaService } from '../../common/database';

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, createCommentDto: CreateCommentDto) {
    const currentPost = await this.prisma.posts.findUnique({
      where: {
        id: createCommentDto.post_id,
      },
    });

    if (!currentPost) {
      throw new HttpException('Post não localizado', 404);
    }

    const createComment = await this.prisma.comments.create({
      data: {
        post_id: createCommentDto.post_id,
        user_id: userId,
        content: createCommentDto.content,
      },
    });

    return createComment;
  }

  async findAll(postId: number) {
    return await this.prisma.comments.findMany({
      select: {
        id: true,
        content: true,
        create_date: true,
        users: {
          select: {
            name: true,
            id: true,
          },
        },
      },
      where: {
        post_id: postId,
      },
      orderBy: {
        id: 'asc',
      },
    });
  }

  async update(id: number, updateCommentDto: UpdateCommentDto) {
    const currentPost = await this.prisma.comments.findUnique({
      where: {
        id: id,
      },
    });

    if (!currentPost) {
      throw new HttpException('Comentário não localizado', 404);
    }

    await this.prisma.comments.update({
      where: {
        id,
      },
      data: {
        content: updateCommentDto.content,
      },
    });
    return ``;
  }

  async remove(id: number) {
    const currentComment = await this.prisma.comments.findUnique({
      where: {
        id,
      },
    });

    if (!currentComment) {
      throw new HttpException('Comentário não localizado', 404);
    }

    await this.prisma.comments.delete({
      where: {
        id,
      },
    });
    return '';
  }
}
