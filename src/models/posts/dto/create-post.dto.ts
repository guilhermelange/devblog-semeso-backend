import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  time_read: number;

  @ApiProperty()
  slug: string;

  @ApiProperty()
  upload_image: boolean;
}
