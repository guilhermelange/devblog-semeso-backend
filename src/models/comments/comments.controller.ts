import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Request } from 'express';
import { Public } from 'src/common/decorator/public.decorator';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@Controller('comments')
@ApiTags('Comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @ApiOperation({ summary: 'Criar comentários' })
  create(@Req() request: Request, @Body() createCommentDto: CreateCommentDto) {
    const { id: userId } = request?.user ?? {};
    return this.commentsService.create(+userId, createCommentDto);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Buscar comentários pelo ID do Post' })
  findOne(@Param('id') postId: string) {
    return this.commentsService.findAll(+postId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar comentário' })
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentsService.update(+id, updateCommentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar comentário' })
  remove(@Param('id') id: string) {
    return this.commentsService.remove(+id);
  }
}
