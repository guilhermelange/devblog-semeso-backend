import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty()
  post_id: number;

  @ApiProperty()
  content: string;
}
