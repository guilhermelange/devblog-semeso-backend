import { ApiProperty } from '@nestjs/swagger';

export class UpdatePostDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;
}

export class FavoritePostDto {
  @ApiProperty()
  favorite: boolean;
}
